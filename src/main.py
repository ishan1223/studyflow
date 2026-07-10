import logging
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
import psycopg2.extras
from datetime import timedelta, date, datetime
import random
from jose import jwt, JWTError
from typing import List, Optional
import os
import re
from fastapi.responses import JSONResponse

# --- Import our custom modules ---
# MODIFIED: Import the new, advanced functions
from .learning_models import (
    select_difficulty_ultra_responsive,
    update_bandit_state_enhanced
)
from .adaptive_engine import get_db_connection, select_question
from . import security
from .db_models import User

# MODIFIED: Add SentenceTransformer imports directly, as it's no longer in learning_models.py
try:
    from sentence_transformers import SentenceTransformer, util
except Exception as exc:  # pragma: no cover - defensive fallback
    SentenceTransformer = None
    util = None
    SENTENCE_TRANSFORMER_IMPORT_ERROR = exc
else:
    SENTENCE_TRANSFORMER_IMPORT_ERROR = None

# --- Basic App Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = FastAPI(title="StudyFlow AI Engine", version="1.0.0")

origins = [ "http://localhost", "http://localhost:5500", "http://127.0.0.1:5500" ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # Bearer-token auth is used (no cookies), so credentialed CORS is not needed.
    # Keeping this False is what makes the "*" wildcard origin valid for browsers.
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
similarity_model = None
similarity_model_error = None


def _load_similarity_model():
    global similarity_model, similarity_model_error
    if similarity_model is not None:
        return similarity_model

    if SentenceTransformer is None or util is None:
        similarity_model_error = SENTENCE_TRANSFORMER_IMPORT_ERROR or RuntimeError("sentence-transformers is not available")
        return None

    try:
        similarity_model = SentenceTransformer(
            'all-MiniLM-L6-v2',
            cache_folder=os.environ.get('TRANSFORMERS_CACHE', './model_cache')
        )
        similarity_model_error = None
        return similarity_model
    except Exception as exc:  # pragma: no cover - defensive fallback
        similarity_model_error = exc
        logging.warning("Falling back to heuristic similarity scoring because the embedding model could not be loaded: %s", exc)
        return None


def _token_overlap_similarity(text_a: str, text_b: str) -> float:
    if not text_a or not text_b:
        return 0.0

    normalized_a = re.findall(r"\w+", text_a.lower())
    normalized_b = re.findall(r"\w+", text_b.lower())
    if not normalized_a or not normalized_b:
        return 0.0

    if normalized_a == normalized_b:
        return 1.0

    set_a = set(normalized_a)
    set_b = set(normalized_b)
    if not set_a or not set_b:
        return 0.0

    overlap = len(set_a & set_b) / len(set_a | set_b)
    return round(overlap, 4)


def compute_similarity_score(text_a: str, text_b: str) -> float:
    model = _load_similarity_model()
    if model is None or util is None:
        return _token_overlap_similarity(text_a, text_b)

    try:
        embedding1 = model.encode(text_a.lower().strip(), convert_to_tensor=True)
        embedding2 = model.encode(text_b.lower().strip(), convert_to_tensor=True)
        return float(util.cos_sim(embedding1, embedding2).item())
    except Exception as exc:  # pragma: no cover - defensive fallback
        logging.warning("Embedding similarity computation failed, falling back to heuristic scoring: %s", exc)
        return _token_overlap_similarity(text_a, text_b)

# --- Pydantic Models for API Data (Unchanged) ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserInDB(User):
    is_admin: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str

class NextQuestionRequest(BaseModel):
    lesson_id: int

class AnswerSubmission(BaseModel):
    lesson_id: int
    question_id: int
    difficulty_answered: int
    user_answer: str

class QuestResponse(BaseModel):
    title: str
    description: str
    current_progress: int
    completion_target: int
    xp_reward: int
    is_completed: bool

class UserStatsResponse(BaseModel):
    xp: int
    streak_count: int
    last_login_date: datetime

class AchievementResponse(BaseModel):
    name: str
    description: str
    icon_class: str
    unlocked_at: datetime
    
# Admin Models (Unchanged)
class UserAdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., min_length=8)
    xp: int = 0
    is_admin: bool = False

class UserAdminUpdate(BaseModel):
    username: str
    email: EmailStr
    xp: int
    is_admin: bool
    password: Optional[str] = Field(None, min_length=8)

class UserAdminResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    xp: int
    is_admin: bool

class QuestionAdmin(BaseModel):
    id: int
    lesson_id: int
    question_text: str
    difficulty_level: int

class QuestionCreateUpdate(BaseModel):
    lesson_id: int
    question_text: str
    difficulty_level: int
    correct_answer_text: str

class AdminStats(BaseModel):
    total_users: int
    total_questions: int
    total_answers_submitted: int
    questions_by_difficulty: dict

# --- Achievement Helper Function (Unchanged) ---
def check_and_award_achievements(user_id: int, conn, cur):
    cur.execute("SELECT id, name, criteria_type, criteria_value, xp_reward FROM achievements WHERE id NOT IN (SELECT achievement_id FROM user_achievements WHERE user_id = %s)", (user_id,))
    unearned_achievements = cur.fetchall()
    if not unearned_achievements: return
    cur.execute("SELECT streak_count FROM users WHERE id = %s", (user_id,))
    user_stats = cur.fetchone()
    cur.execute("SELECT COUNT(*) FROM user_progress WHERE user_id = %s", (user_id,))
    total_answers = cur.fetchone()['count']
    cur.execute("SELECT COUNT(*) FROM user_progress WHERE user_id = %s AND is_correct = TRUE", (user_id,))
    total_correct_answers = cur.fetchone()['count']
    xp_to_add = 0
    for achievement in unearned_achievements:
        unlocked = False
        if achievement['criteria_type'] == 'STREAK' and user_stats['streak_count'] >= achievement['criteria_value']: unlocked = True
        elif achievement['criteria_type'] == 'ANSWERS_TOTAL' and total_answers >= achievement['criteria_value']: unlocked = True
        elif achievement['criteria_type'] == 'CORRECT_ANSWERS_TOTAL' and total_correct_answers >= achievement['criteria_value']: unlocked = True
        if unlocked:
            cur.execute("INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s)", (user_id, achievement['id']))
            xp_to_add += achievement['xp_reward']
            logging.info(f"User {user_id} unlocked achievement '{achievement['name']}'!")
    if xp_to_add > 0: cur.execute("UPDATE users SET xp = xp + %s WHERE id = %s", (xp_to_add, user_id))


# --- Security & Dependencies (Unchanged) ---
def get_current_user(token: str = Depends(security.oauth2_scheme)) -> User:
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        if username is None: raise credentials_exception
    except JWTError: raise credentials_exception
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT id, username, email, xp, is_admin FROM users WHERE username = %s", (username,))
    user_data = cur.fetchone()
    cur.close()
    conn.close()
    if user_data is None: raise credentials_exception
    return UserInDB.model_validate(dict(user_data))

def get_current_admin_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator access required.")
    return current_user


# --- Learner Endpoints ---
@app.post("/signup", summary="Create a new user", status_code=status.HTTP_201_CREATED)
def create_user_learner(user: UserCreate):
    # This function is unchanged
    hashed_password = security.get_password_hash(user.password)
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id;", (user.username, user.email, hashed_password))
        new_user_id = cur.fetchone()[0]
        conn.commit()
    except psycopg2.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Username or email already registered.")
    finally:
        cur.close()
        conn.close()
    return {"id": new_user_id, "username": user.username, "email": user.email}

@app.post("/token", response_model=Token, summary="User login")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # This function is unchanged
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM users WHERE username = %s", (form_data.username,))
    user = cur.fetchone()
    if not user or not security.verify_password(form_data.password, user['password_hash']):
        cur.close()
        conn.close()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    today = date.today()
    last_login = user['last_login_date']
    new_streak = user['streak_count']
    if last_login is None: new_streak = 1
    elif last_login < today:
        if last_login == today - timedelta(days=1): new_streak += 1
        else: new_streak = 1
    cur.execute("UPDATE users SET streak_count = %s, last_login_date = %s WHERE id = %s", (new_streak, today, user['id']))
    check_and_award_achievements(user['id'], conn, cur)
    conn.commit()
    cur.close()
    conn.close()
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data={"sub": user['username']}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/next_question", summary="Get the next AI-selected question (Protected)", tags=["Learner"])
def get_next_question(req: NextQuestionRequest, current_user: User = Depends(get_current_user)):
    # The AI decides the IDEAL difficulty
    optimal_difficulty = select_difficulty_ultra_responsive(current_user.id, req.lesson_id)
    
    # Unpack the THREE values from the new select_question function
    question_id, question_text, actual_difficulty = select_question(optimal_difficulty, req.lesson_id)
    
    if question_id is None:
        raise HTTPException(status_code=404, detail="No questions found for this lesson.")
        
    # Return the ACTUAL difficulty of the question served
    return {"difficulty_level": actual_difficulty, "question_id": question_id, "question_text": question_text}

@app.post("/submit_answer", summary="Submit an answer (Protected)", tags=["Learner"])
def submit_answer(submission: AnswerSubmission, current_user: User = Depends(get_current_user)):
    # MODIFIED: Logic updated to use new functions
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT correct_answer_text FROM questions WHERE id = %s;", (submission.question_id,))
        result = cur.fetchone()
        if not result: raise HTTPException(status_code=404, detail="Question ID not found.")
        
        correct_answer = result['correct_answer_text']
        
        # Perform similarity check directly in the endpoint
        similarity_score = compute_similarity_score(submission.user_answer, correct_answer)
        is_correct = similarity_score > 0.8
        
        # Call the new, enhanced update function
        update_bandit_state_enhanced(
            user_id=current_user.id, 
            lesson_id=submission.lesson_id, 
            difficulty=submission.difficulty_answered, 
            was_correct=is_correct
        )
        
        cur.execute("INSERT INTO user_progress (user_id, question_id, is_correct) VALUES (%s, %s, %s);", (current_user.id, submission.question_id, is_correct))
        
        xp_gain = 10 if is_correct else 0
        quest_completed_this_turn = False
        
        cur.execute("SELECT uq.id, uq.current_progress, q.quest_type, q.completion_target, q.xp_reward FROM user_quests uq JOIN quests q ON uq.quest_id = q.id WHERE uq.user_id = %s AND uq.assigned_date = CURRENT_DATE AND uq.is_completed = FALSE;", (current_user.id,))
        active_quest = cur.fetchone()
        if active_quest:
            quest_progress_updated = (active_quest['quest_type'] == 'TOTAL_ANSWERS') or (active_quest['quest_type'] == 'CORRECT_ANSWERS' and is_correct)
            if quest_progress_updated:
                new_progress = active_quest['current_progress'] + 1
                cur.execute("UPDATE user_quests SET current_progress = %s WHERE id = %s", (new_progress, active_quest['id']))
                if new_progress >= active_quest['completion_target']:
                    cur.execute("UPDATE user_quests SET is_completed = TRUE WHERE id = %s", (active_quest['id'],))
                    xp_gain += active_quest['xp_reward']
                    quest_completed_this_turn = True
        
        if xp_gain > 0: cur.execute("UPDATE users SET xp = xp + %s WHERE id = %s;", (xp_gain, current_user.id))
        
        check_and_award_achievements(current_user.id, conn, cur)
        conn.commit()

        return {"status": "Answer processed", "is_correct": is_correct, "similarity_score": round(similarity_score, 2), "quest_completed": quest_completed_this_turn}
    finally:
        cur.close()
        conn.close()

@app.get("/users/me/stats", response_model=UserStatsResponse, summary="Get current user's stats (Protected)", tags=["Learner"])
def get_user_stats(current_user: User = Depends(get_current_user)):
    # This function is unchanged
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT xp, streak_count, last_login_date FROM users WHERE id = %s", (current_user.id,))
    stats = cur.fetchone()
    cur.close()
    conn.close()
    if not stats: raise HTTPException(status_code=404, detail="User not found.")
    return UserStatsResponse(xp=stats['xp'], streak_count=stats['streak_count'], last_login_date=stats['last_login_date'])

@app.get("/quests/today", response_model=QuestResponse, summary="Get today's quest (Protected)", tags=["Learner"])
def get_daily_quest(current_user: User = Depends(get_current_user)):
    # This function is unchanged
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT q.title, q.description, uq.current_progress, q.completion_target, q.xp_reward, uq.is_completed FROM user_quests uq JOIN quests q ON uq.quest_id = q.id WHERE uq.user_id = %s AND uq.assigned_date = CURRENT_DATE;", (current_user.id,))
    quest_data = cur.fetchone()
    if not quest_data:
        cur.execute("SELECT id FROM quests WHERE quest_type != 'TIME_BASED' ORDER BY RANDOM() LIMIT 1")
        random_quest = cur.fetchone()
        if not random_quest:
            cur.close()
            conn.close()
            raise HTTPException(status_code=404, detail="No available quests to assign.")
        cur.execute("INSERT INTO user_quests (user_id, quest_id) VALUES (%s, %s) RETURNING id;", (current_user.id, random_quest['id']))
        conn.commit()
        cur.execute("SELECT q.title, q.description, uq.current_progress, q.completion_target, q.xp_reward, uq.is_completed FROM user_quests uq JOIN quests q ON uq.quest_id = q.id WHERE uq.user_id = %s AND uq.assigned_date = CURRENT_DATE;", (current_user.id,))
        quest_data = cur.fetchone()
    cur.close()
    conn.close()
    return QuestResponse(**quest_data)

@app.get("/achievements", response_model=List[AchievementResponse], summary="Get user's unlocked achievements", tags=["Learner"])
def get_user_achievements(current_user: User = Depends(get_current_user)):
    # This function is unchanged
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT a.name, a.description, a.icon_class, ua.unlocked_at FROM user_achievements ua JOIN achievements a ON ua.achievement_id = a.id WHERE ua.user_id = %s ORDER BY ua.unlocked_at DESC;", (current_user.id,))
    achievements = cur.fetchall()
    cur.close()
    conn.close()
    return [AchievementResponse(**ach) for ach in achievements]


# ===================================================================
# ===================== ADMIN PANEL ENDPOINTS =======================
# ===================================================================

@app.post("/admin/token", response_model=Token, summary="Admin user login", tags=["Admin"])
def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM users WHERE username = %s", (form_data.username,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if not user or not user['is_admin'] or not security.verify_password(form_data.password, user['password_hash']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password, or not an admin.")
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data={"sub": user['username']}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/admin/stats", response_model=AdminStats, summary="Get dashboard statistics", tags=["Admin"])
def get_admin_stats(admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT count(*) FROM users;")
    total_users = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM questions;")
    total_questions = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM user_progress;")
    total_answers = cur.fetchone()[0]
    cur.execute("SELECT difficulty_level, count(*) FROM questions GROUP BY difficulty_level;")
    difficulty_counts = {str(row['difficulty_level']): row['count'] for row in cur.fetchall()}
    cur.close()
    conn.close()
    return {"total_users": total_users, "total_questions": total_questions, "total_answers_submitted": total_answers, "questions_by_difficulty": difficulty_counts}

@app.get("/admin/users", response_model=List[UserAdminResponse], summary="Get all users", tags=["Admin"])
def get_all_users(admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT id, username, email, xp, is_admin FROM users ORDER BY id ASC;")
    users = [UserAdminResponse.model_validate(dict(row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return users

@app.get("/admin/users/{user_id}", response_model=UserAdminResponse, summary="Get a single user by ID", tags=["Admin"])
def get_user_by_id(user_id: int, admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT id, username, email, xp, is_admin FROM users WHERE id = %s;", (user_id,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if not user: raise HTTPException(status_code=404, detail="User not found.")
    return UserAdminResponse.model_validate(dict(user))

@app.post("/admin/users", response_model=UserAdminResponse, status_code=status.HTTP_201_CREATED, summary="Create a new user as Admin", tags=["Admin"])
def create_user_admin(user: UserAdminCreate, admin: UserInDB = Depends(get_current_admin_user)):
    hashed_password = security.get_password_hash(user.password)
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("INSERT INTO users (username, email, password_hash, xp, is_admin) VALUES (%s, %s, %s, %s, %s) RETURNING id;", (user.username, user.email, hashed_password, user.xp, user.is_admin))
        new_user_id = cur.fetchone()['id']
        conn.commit()
    except psycopg2.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Username or email already in use.")
    finally:
        cur.close()
        conn.close()
    return UserAdminResponse(id=new_user_id, **user.model_dump())

@app.put("/admin/users/{user_id}", response_model=UserAdminResponse, summary="Update a user as Admin", tags=["Admin"])
def update_user_admin(user_id: int, user_update: UserAdminUpdate, admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    if user_update.password:
        hashed_password = security.get_password_hash(user_update.password)
        cur.execute("UPDATE users SET username=%s, email=%s, xp=%s, is_admin=%s, password_hash=%s WHERE id=%s RETURNING id;", (user_update.username, user_update.email, user_update.xp, user_update.is_admin, hashed_password, user_id))
    else:
        cur.execute("UPDATE users SET username=%s, email=%s, xp=%s, is_admin=%s WHERE id=%s RETURNING id;", (user_update.username, user_update.email, user_update.xp, user_update.is_admin, user_id))
    
    updated_user = cur.fetchone()
    if updated_user is None: raise HTTPException(status_code=404, detail="User not found.")
    conn.commit()
    cur.close()
    conn.close()
    return UserAdminResponse(id=user_id, **user_update.model_dump())

@app.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a user", tags=["Admin"])
def delete_user(user_id: int, admin: UserInDB = Depends(get_current_admin_user)):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Admins cannot delete their own account.")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id = %s RETURNING id;", (user_id,))
    if cur.fetchone() is None: raise HTTPException(status_code=404, detail="User not found.")
    conn.commit()
    cur.close()
    conn.close()
    return

@app.get("/admin/questions", response_model=List[QuestionAdmin], summary="Get all questions", tags=["Admin"])
def get_all_questions(admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT id, lesson_id, content as question_text, difficulty_level FROM questions ORDER BY id DESC;")
    questions = [QuestionAdmin.model_validate(dict(row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return questions

@app.post("/admin/questions", response_model=QuestionAdmin, status_code=status.HTTP_201_CREATED, summary="Create a new question", tags=["Admin"])
def create_question(question: QuestionCreateUpdate, admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("INSERT INTO questions (lesson_id, content, difficulty_level, correct_answer_text) VALUES (%s, %s, %s, %s) RETURNING id;", (question.lesson_id, question.question_text, question.difficulty_level, question.correct_answer_text))
    new_id = cur.fetchone()['id']
    conn.commit()
    cur.close()
    conn.close()
    return {**question.model_dump(exclude={"correct_answer_text"}), "id": new_id, "question_text": question.question_text}

@app.put("/admin/questions/{question_id}", response_model=QuestionAdmin, summary="Update a question", tags=["Admin"])
def update_question(question_id: int, question: QuestionCreateUpdate, admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("UPDATE questions SET lesson_id=%s, content=%s, difficulty_level=%s, correct_answer_text=%s WHERE id=%s RETURNING id;", (question.lesson_id, question.question_text, question.difficulty_level, question.correct_answer_text, question_id))
    if cur.fetchone() is None: raise HTTPException(status_code=404, detail="Question not found.")
    conn.commit()
    cur.close()
    conn.close()
    return {**question.model_dump(exclude={"correct_answer_text"}), "id": question_id, "question_text": question.question_text}

@app.delete("/admin/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a question", tags=["Admin"])
def delete_question(question_id: int, admin: UserInDB = Depends(get_current_admin_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM questions WHERE id = %s RETURNING id;", (question_id,))
    if cur.fetchone() is None: raise HTTPException(status_code=404, detail="Question not found.")
    conn.commit()
    cur.close()
    conn.close()
    return

@app.get("/users/me", summary="Get current user's profile info", tags=["Learner"])
def get_current_user_profile(current_user: UserInDB = Depends(get_current_user)):
    return JSONResponse(content={
        "username": current_user.username,
        "email": current_user.email
    })


# ============================================================
# StudyFlow v2 — Smart Student Features
# ============================================================

# ── Pydantic Models ──────────────────────────────────────────

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[date] = None
    tags: Optional[List[str]] = []
    list_id: Optional[int] = None
    xp_reward: int = 10

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None
    tags: Optional[List[str]] = None
    is_pinned: Optional[bool] = None

class NoteCreate(BaseModel):
    title: str = "Untitled Note"
    content: Optional[str] = None
    color: str = "#FFFFFF"
    tags: Optional[List[str]] = []

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    color: Optional[str] = None
    is_pinned: Optional[bool] = None
    tags: Optional[List[str]] = None

class PomodoroCreate(BaseModel):
    subject: Optional[str] = None
    duration_minutes: int = 25
    break_minutes: int = 5
    total_rounds: int = 4
    todo_id: Optional[int] = None

class PomodoroUpdate(BaseModel):
    completed_rounds: Optional[int] = None
    status: Optional[str] = None

class GoalCreate(BaseModel):
    title: str
    target_minutes: int

class GoalUpdate(BaseModel):
    current_minutes: Optional[int] = None
    is_active: Optional[bool] = None


# ── TODO ENDPOINTS ───────────────────────────────────────────

@app.get("/todos", tags=["Todos"])
def get_todos(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT id, title, description, priority, status, due_date, tags,
               is_pinned, xp_reward, created_at, completed_at
        FROM todos
        WHERE user_id = %s
        ORDER BY is_pinned DESC,
                 CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2
                               WHEN 'medium' THEN 3 ELSE 4 END,
                 due_date ASC NULLS LAST,
                 created_at DESC
    """, (current_user.id,))
    rows = cur.fetchall()
    cur.close(); conn.close()
    return [dict(r) for r in rows]

@app.post("/todos", status_code=201, tags=["Todos"])
def create_todo(todo: TodoCreate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            INSERT INTO todos (user_id, list_id, title, description, priority, due_date, tags, xp_reward)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (current_user.id, todo.list_id, todo.title, todo.description,
              todo.priority, todo.due_date, todo.tags, todo.xp_reward))
        new_todo = cur.fetchone()
        conn.commit()
        return dict(new_todo)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()

@app.patch("/todos/{todo_id}", tags=["Todos"])
def update_todo(todo_id: int, update: TodoUpdate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT id, status, xp_reward FROM todos WHERE id = %s AND user_id = %s",
                    (todo_id, current_user.id))
        existing = cur.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Todo not found")

        fields = []
        values = []
        update_data = update.model_dump(exclude_none=True)

        if update_data.get("status") == "done" and existing["status"] != "done":
            fields.append("completed_at = NOW()")
            cur.execute("UPDATE users SET xp = xp + %s WHERE id = %s",
                        (existing["xp_reward"], current_user.id))
        elif update_data.get("status") and update_data["status"] != "done":
            fields.append("completed_at = NULL")

        for k, v in update_data.items():
            fields.append(f"{k} = %s")
            values.append(v)

        if not fields:
            return dict(existing)

        values.extend([todo_id, current_user.id])
        cur.execute(
            f"UPDATE todos SET {', '.join(fields)} WHERE id = %s AND user_id = %s RETURNING *",
            values
        )
        updated = cur.fetchone()
        conn.commit()
        return dict(updated)
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()

@app.delete("/todos/{todo_id}", status_code=204, tags=["Todos"])
def delete_todo(todo_id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM todos WHERE id = %s AND user_id = %s", (todo_id, current_user.id))
    conn.commit()
    cur.close(); conn.close()

@app.get("/todos/stats", tags=["Todos"])
def get_todo_stats(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT
            COUNT(*) FILTER (WHERE status = 'done') AS completed,
            COUNT(*) FILTER (WHERE status != 'done') AS pending,
            COUNT(*) FILTER (WHERE due_date = CURRENT_DATE AND status != 'done') AS due_today,
            COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'done') AS overdue,
            COALESCE(SUM(xp_reward) FILTER (WHERE status = 'done'), 0) AS xp_earned
        FROM todos WHERE user_id = %s
    """, (current_user.id,))
    row = cur.fetchone()
    cur.close(); conn.close()
    return dict(row)


# ── NOTES ENDPOINTS ──────────────────────────────────────────

@app.get("/notes", tags=["Notes"])
def get_notes(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT id, title, content, color, is_pinned, tags, created_at, updated_at
        FROM notes WHERE user_id = %s
        ORDER BY is_pinned DESC, updated_at DESC
    """, (current_user.id,))
    rows = cur.fetchall()
    cur.close(); conn.close()
    return [dict(r) for r in rows]

@app.post("/notes", status_code=201, tags=["Notes"])
def create_note(note: NoteCreate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            INSERT INTO notes (user_id, title, content, color, tags)
            VALUES (%s, %s, %s, %s, %s) RETURNING *
        """, (current_user.id, note.title, note.content, note.color, note.tags))
        new_note = cur.fetchone()
        conn.commit()
        return dict(new_note)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()

@app.patch("/notes/{note_id}", tags=["Notes"])
def update_note(note_id: int, update: NoteUpdate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        update_data = update.model_dump(exclude_none=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        update_data["updated_at"] = datetime.utcnow()
        fields = [f"{k} = %s" for k in update_data.keys()]
        values = list(update_data.values()) + [note_id, current_user.id]
        cur.execute(
            f"UPDATE notes SET {', '.join(fields)} WHERE id = %s AND user_id = %s RETURNING *",
            values
        )
        updated = cur.fetchone()
        if not updated:
            raise HTTPException(status_code=404, detail="Note not found")
        conn.commit()
        return dict(updated)
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()

@app.delete("/notes/{note_id}", status_code=204, tags=["Notes"])
def delete_note(note_id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM notes WHERE id = %s AND user_id = %s", (note_id, current_user.id))
    conn.commit()
    cur.close(); conn.close()


# ── POMODORO ENDPOINTS ───────────────────────────────────────

@app.post("/pomodoro", status_code=201, tags=["Pomodoro"])
def start_pomodoro(session: PomodoroCreate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            INSERT INTO pomodoro_sessions
                (user_id, todo_id, subject, duration_minutes, break_minutes, total_rounds)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING *
        """, (current_user.id, session.todo_id, session.subject,
              session.duration_minutes, session.break_minutes, session.total_rounds))
        new_session = cur.fetchone()
        conn.commit()
        return dict(new_session)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()

@app.patch("/pomodoro/{session_id}", tags=["Pomodoro"])
def update_pomodoro(session_id: int, update: PomodoroUpdate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        update_data = update.model_dump(exclude_none=True)
        if update_data.get("status") in ("completed", "abandoned"):
            update_data["ended_at"] = datetime.utcnow()
            if update_data["status"] == "completed":
                rounds = update_data.get("completed_rounds", 0)
                xp_gain = rounds * 15
                if xp_gain > 0:
                    cur.execute("UPDATE users SET xp = xp + %s WHERE id = %s",
                                (xp_gain, current_user.id))
                cur.execute("""
                    SELECT duration_minutes FROM pomodoro_sessions
                    WHERE id = %s AND user_id = %s
                """, (session_id, current_user.id))
                sess_data = cur.fetchone()
                if sess_data:
                    minutes_studied = rounds * sess_data['duration_minutes']
                    cur.execute("""
                        UPDATE study_goals
                        SET current_minutes = current_minutes + %s
                        WHERE user_id = %s
                          AND is_active = TRUE
                          AND week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE
                    """, (minutes_studied, current_user.id))

        fields = [f"{k} = %s" for k in update_data.keys()]
        values = list(update_data.values()) + [session_id, current_user.id]
        cur.execute(
            f"UPDATE pomodoro_sessions SET {', '.join(fields)} WHERE id = %s AND user_id = %s RETURNING *",
            values
        )
        updated = cur.fetchone()
        if not updated:
            raise HTTPException(status_code=404, detail="Session not found")
        conn.commit()
        return dict(updated)
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()

@app.get("/pomodoro/history", tags=["Pomodoro"])
def get_pomodoro_history(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT p.*, t.title AS task_title
        FROM pomodoro_sessions p
        LEFT JOIN todos t ON t.id = p.todo_id
        WHERE p.user_id = %s
        ORDER BY p.started_at DESC
        LIMIT 20
    """, (current_user.id,))
    rows = cur.fetchall()
    cur.close(); conn.close()
    return [dict(r) for r in rows]


# ── STUDY GOALS ENDPOINTS ────────────────────────────────────

@app.get("/goals", tags=["Goals"])
def get_goals(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("""
        SELECT * FROM study_goals
        WHERE user_id = %s AND is_active = TRUE
        ORDER BY created_at DESC
    """, (current_user.id,))
    rows = cur.fetchall()
    cur.close(); conn.close()
    return [dict(r) for r in rows]

@app.post("/goals", status_code=201, tags=["Goals"])
def create_goal(goal: GoalCreate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("""
            INSERT INTO study_goals (user_id, title, target_minutes)
            VALUES (%s, %s, %s) RETURNING *
        """, (current_user.id, goal.title, goal.target_minutes))
        new_goal = cur.fetchone()
        conn.commit()
        return dict(new_goal)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()

@app.patch("/goals/{goal_id}", tags=["Goals"])
def update_goal(goal_id: int, update: GoalUpdate, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        update_data = update.model_dump(exclude_none=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        fields = [f"{k} = %s" for k in update_data.keys()]
        values = list(update_data.values()) + [goal_id, current_user.id]
        cur.execute(
            f"UPDATE study_goals SET {', '.join(fields)} WHERE id = %s AND user_id = %s RETURNING *",
            values
        )
        updated = cur.fetchone()
        if not updated:
            raise HTTPException(status_code=404, detail="Goal not found")
        conn.commit()
        return dict(updated)
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close(); conn.close()


# ── HUB SUMMARY ENDPOINT ─────────────────────────────────────

@app.get("/hub/summary", tags=["Hub"])
def get_hub_summary(current_user: User = Depends(get_current_user)):
    """Single endpoint to load the Hub page — returns todos + notes + goals + pomodoro stats."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("""
        SELECT id, title, priority, status, due_date, is_pinned, xp_reward
        FROM todos WHERE user_id = %s AND status != 'done'
        ORDER BY is_pinned DESC,
                 CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2
                               WHEN 'medium' THEN 3 ELSE 4 END,
                 due_date ASC NULLS LAST
        LIMIT 10
    """, (current_user.id,))
    todos = [dict(r) for r in cur.fetchall()]

    cur.execute("""
        SELECT COUNT(*) FILTER (WHERE status='done') done,
               COUNT(*) FILTER (WHERE status!='done') pending,
               COUNT(*) FILTER (WHERE due_date=CURRENT_DATE AND status!='done') due_today
        FROM todos WHERE user_id = %s
    """, (current_user.id,))
    todo_stats = dict(cur.fetchone())

    cur.execute("""
        SELECT id, title, color, is_pinned, updated_at
        FROM notes WHERE user_id = %s
        ORDER BY is_pinned DESC, updated_at DESC LIMIT 6
    """, (current_user.id,))
    notes = [dict(r) for r in cur.fetchall()]

    cur.execute("""
        SELECT id, title, target_minutes, current_minutes
        FROM study_goals
        WHERE user_id = %s AND is_active = TRUE
          AND week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE
    """, (current_user.id,))
    goals = [dict(r) for r in cur.fetchall()]

    cur.execute("""
        SELECT COUNT(*) AS sessions_this_week,
               COALESCE(SUM(completed_rounds), 0) AS rounds_this_week,
               COALESCE(SUM(completed_rounds * duration_minutes), 0) AS minutes_this_week
        FROM pomodoro_sessions
        WHERE user_id = %s
          AND status = 'completed'
          AND started_at >= DATE_TRUNC('week', CURRENT_TIMESTAMP)
    """, (current_user.id,))
    pomodoro_stats = dict(cur.fetchone())

    cur.close(); conn.close()
    return {
        "todos": todos,
        "todo_stats": todo_stats,
        "notes": notes,
        "goals": goals,
        "pomodoro_stats": pomodoro_stats,
    }


# ============================================================
# StudyFlow v2 — Onboarding Features
# ============================================================

class OnboardingSubmit(BaseModel):
    display_name:    Optional[str] = None
    student_type:    Optional[str] = None
    college_name:    Optional[str] = None
    degree:          Optional[str] = None
    study_year:      Optional[str] = None
    branch:          Optional[str] = None
    exam_name:       Optional[str] = None
    exam_date:       Optional[date] = None
    learning_topic:  Optional[str] = None
    learning_goal:   Optional[str] = None
    learning_reason: Optional[str] = None
    daily_minutes:   Optional[int] = 60
    subjects:        Optional[List[str]] = []


@app.get("/onboarding/status", tags=["Onboarding"])
def get_onboarding_status(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT is_onboarded, display_name FROM users WHERE id = %s", (current_user.id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "is_onboarded": bool(row["is_onboarded"]),
            "display_name": row["display_name"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.post("/onboarding", tags=["Onboarding"])
def complete_onboarding(data: OnboardingSubmit, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        update_dict = data.model_dump(exclude_unset=True)
        subjects = update_dict.pop("subjects", None)
        
        update_fields = ["is_onboarded = TRUE"]
        params = []
        for col, val in update_dict.items():
            if val is not None:
                update_fields.append(f"{col} = %s")
                params.append(val)
                
        params.append(current_user.id)
        
        query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
        cur.execute(query, params)
        
        if subjects:
            colors = ['#7C3AED','#6366F1','#F59E0B','#16A34A','#EF4444','#EC4899','#0EA5E9','#14B8A6']
            for i, subj in enumerate(subjects):
                color = colors[i % len(colors)]
                cur.execute(
                    "INSERT INTO subjects (user_id, name, color) VALUES (%s, %s, %s)",
                    (current_user.id, subj, color)
                )
        
        cur.execute("UPDATE users SET xp = xp + 50 WHERE id = %s", (current_user.id,))
        conn.commit()
        return {"success": True, "xp_earned": 50}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.get("/subjects", tags=["Subjects"])
def get_subjects(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute("SELECT id, name, color FROM subjects WHERE user_id = %s ORDER BY created_at ASC", (current_user.id,))
        rows = cur.fetchall()
        return [dict(r) for r in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


# ============================================================
# StudyFlow v2 — Profile, Progress, AI Planner
# ============================================================

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    email: Optional[EmailStr] = None
    college_name: Optional[str] = None
    degree: Optional[str] = None
    study_year: Optional[str] = None
    branch: Optional[str] = None
    daily_minutes: Optional[int] = None


@app.put("/users/me", tags=["Learner"])
def update_current_user_profile(update: ProfileUpdate, current_user: User = Depends(get_current_user)):
    """Update mutable profile fields for the authenticated user."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        update_data = update.model_dump(exclude_none=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update.")
        fields = [f"{k} = %s" for k in update_data.keys()]
        values = list(update_data.values()) + [current_user.id]
        cur.execute(
            f"UPDATE users SET {', '.join(fields)} WHERE id = %s RETURNING id, username, email, xp",
            values
        )
        updated = cur.fetchone()
        if not updated:
            raise HTTPException(status_code=404, detail="User not found.")
        conn.commit()
        return dict(updated)
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


@app.get("/progress/weekly", tags=["Progress"])
def get_weekly_progress(current_user: User = Depends(get_current_user)):
    """Return a week-by-week progress summary: tasks completed, pomodoro minutes, XP, streaks."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        # Tasks completed per day (last 7 days)
        cur.execute("""
            SELECT
                TO_CHAR(completed_at::date, 'Dy') AS day_label,
                COUNT(*) AS tasks_done
            FROM todos
            WHERE user_id = %s
              AND status = 'done'
              AND completed_at >= NOW() - INTERVAL '7 days'
            GROUP BY completed_at::date, day_label
            ORDER BY completed_at::date ASC
        """, (current_user.id,))
        tasks_per_day = [dict(r) for r in cur.fetchall()]

        # Pomodoro minutes per day (last 7 days)
        cur.execute("""
            SELECT
                TO_CHAR(started_at::date, 'Dy') AS day_label,
                COALESCE(SUM(completed_rounds * duration_minutes), 0) AS minutes_studied
            FROM pomodoro_sessions
            WHERE user_id = %s
              AND status = 'completed'
              AND started_at >= NOW() - INTERVAL '7 days'
            GROUP BY started_at::date, day_label
            ORDER BY started_at::date ASC
        """, (current_user.id,))
        minutes_per_day = [dict(r) for r in cur.fetchall()]

        # Overall totals
        cur.execute("""
            SELECT
                COUNT(*) FILTER (WHERE status = 'done') AS total_completed,
                COUNT(*) FILTER (WHERE status != 'done') AS total_pending,
                COALESCE(SUM(xp_reward) FILTER (WHERE status = 'done'), 0) AS total_xp_tasks
            FROM todos WHERE user_id = %s
        """, (current_user.id,))
        task_totals = dict(cur.fetchone())

        # Pomodoro totals this week
        cur.execute("""
            SELECT
                COUNT(*) AS pomo_sessions,
                COALESCE(SUM(completed_rounds), 0) AS pomo_rounds,
                COALESCE(SUM(completed_rounds * duration_minutes), 0) AS pomo_minutes
            FROM pomodoro_sessions
            WHERE user_id = %s
              AND status = 'completed'
              AND started_at >= DATE_TRUNC('week', CURRENT_TIMESTAMP)
        """, (current_user.id,))
        pomo_totals = dict(cur.fetchone())

        # User XP and streak
        cur.execute("SELECT xp, streak_count FROM users WHERE id = %s", (current_user.id,))
        user_row = dict(cur.fetchone())

        # Active weekly goals
        cur.execute("""
            SELECT title, target_minutes, current_minutes
            FROM study_goals
            WHERE user_id = %s AND is_active = TRUE
              AND week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE
            ORDER BY created_at DESC
        """, (current_user.id,))
        goals = [dict(r) for r in cur.fetchall()]

        return {
            "tasks_per_day": tasks_per_day,
            "minutes_per_day": minutes_per_day,
            "task_totals": task_totals,
            "pomo_totals": pomo_totals,
            "xp": user_row.get("xp", 0),
            "streak_count": user_row.get("streak_count", 0),
            "goals": goals,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()


class AIDailyPlanRequest(BaseModel):
    subjects: Optional[List[str]] = []
    available_minutes: int = 60
    priority_area: Optional[str] = None


@app.post("/ai/daily-plan", tags=["AI"])
def generate_daily_plan(req: AIDailyPlanRequest, current_user: User = Depends(get_current_user)):
    """Generate a structured daily study plan and create todos for the user."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        subjects = req.subjects or []
        available_minutes = max(15, req.available_minutes)
        priority_area = req.priority_area or ""

        # Fetch existing pending todos to avoid duplication
        cur.execute(
            "SELECT title FROM todos WHERE user_id = %s AND status != 'done'",
            (current_user.id,)
        )
        existing_titles = {r["title"].lower() for r in cur.fetchall()}

        # Build a deterministic plan based on available time and subjects
        tasks = []
        time_blocks = []

        if available_minutes >= 120:
            # Long session: 3 subjects, review + practice + break
            session_subjects = (subjects + ["General Study"])[:3]
            block_size = available_minutes // len(session_subjects)
            for s in session_subjects:
                time_blocks.append((s, block_size))
        elif available_minutes >= 60:
            session_subjects = (subjects + ["General Study"])[:2]
            block_size = available_minutes // len(session_subjects)
            for s in session_subjects:
                time_blocks.append((s, block_size))
        else:
            sub = (subjects[0] if subjects else "General Study")
            time_blocks.append((sub, available_minutes))

        priorities = ["high", "medium", "low"]
        created_todos = []

        for i, (subject, duration) in enumerate(time_blocks):
            title = f"Study {subject} — {duration} min session"
            if priority_area and priority_area.lower() in subject.lower():
                priority = "urgent"
            else:
                priority = priorities[i % len(priorities)]

            if title.lower() not in existing_titles:
                xp_reward = max(10, duration // 5)
                cur.execute("""
                    INSERT INTO todos (user_id, title, description, priority, xp_reward, tags)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, title, priority, xp_reward
                """, (
                    current_user.id,
                    title,
                    f"AI-planned {duration}-minute study block for {subject}.",
                    priority,
                    xp_reward,
                    [subject, "ai-plan"]
                ))
                new_todo = dict(cur.fetchone())
                created_todos.append(new_todo)

        conn.commit()
        return {
            "plan_summary": f"Created {len(created_todos)} study tasks for {available_minutes} minutes of study.",
            "tasks_created": created_todos
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()