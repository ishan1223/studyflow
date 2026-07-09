document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const API_BASE_URL = 'http://localhost:8000';
    // *** CHANGE HERE: Use the standardized token key ***
    const token = localStorage.getItem('studyflowToken'); 
    const username = localStorage.getItem('username');
    let currentQuestion = null;
    let lessonId = 1; // Assuming a default lesson ID

    // --- Check for Authentication ---
    if (!token || !username) {
        // If no token or username, redirect to login immediately.
        window.location.href = 'auth.html';
        return; // Stop executing the rest of the script
    }

    // --- Populate unified sidebar user chip ---
    const sbName = document.getElementById('sb-name');
    const sbAvatar = document.getElementById('sb-avatar');
    if (sbName) sbName.textContent = username;
    if (sbAvatar) sbAvatar.textContent = username.charAt(0).toUpperCase();

    // --- Element Selections ---
    const usernameDisplay = document.getElementById('username-display');
    const xpCountEl = document.getElementById('xp-count');
    const streakCountEl = document.getElementById('streak-count');
    const dashboardView = document.getElementById('dashboard-view');
    const questionView = document.getElementById('question-view');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    const rootEl = document.documentElement;
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
    const skipQuestionBtn = document.getElementById('skip-question-btn');
    const continueBtn = document.getElementById('continue-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const questTitleEl = document.getElementById('quest-title');
    const questContentEl = document.getElementById('quest-content');
    const achievementsListEl = document.getElementById('achievements-list');
    const questionTextEl = document.getElementById('question-text');
    const userAnswerTextarea = document.getElementById('user-answer');
    const feedbackContainer = document.getElementById('answer-feedback');
    const feedbackIcon = document.getElementById('feedback-icon').querySelector('i');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const similarityScoreEl = document.getElementById('similarity-score');
    const difficultyNumberEl = document.getElementById('difficulty-number');
    const difficultyStarsEl = document.getElementById('difficulty-stars');
    const errorModal = document.getElementById('error-modal');
    const errorModalText = document.getElementById('error-modal-text');
    const errorModalCloseBtn = document.getElementById('error-modal-close-btn');
    const errorModalConfirmBtn = document.getElementById('error-modal-confirm-btn');
    const celebrationEl = document.getElementById('celebration');
    const celebrationTitle = document.getElementById('celebration-title');
    const celebrationMessage = document.getElementById('celebration-message');
    const increaseFontBtn = document.getElementById('increase-font-btn');
    const decreaseFontBtn = document.getElementById('decrease-font-btn');
    const accessibilityToggleBtn = document.getElementById('accessibility-fab-toggle');
    const accessibilityPopup = document.getElementById('accessibility-options-popup');

    // --- Core Functions ---
    const logout = () => {
        localStorage.removeItem('studyflowToken');
        localStorage.removeItem('username');
        window.location.href = 'home.html';
    };

    const apiFetch = async (endpoint, options = {}) => {
        const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (response.status === 401) {
            logout(); // Token is invalid, log out user
            throw new Error('Unauthorized');
        }
        const data = response.status === 204 ? null : await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'An API error occurred.');
        }
        return data;
    };

    const showLoading = (message) => {
        loadingText.textContent = message;
        loadingOverlay.classList.remove('hidden');
    };
    const hideLoading = () => loadingOverlay.classList.add('hidden');
    const showError = (message) => {
        errorModalText.textContent = message;
        errorModal.classList.remove('hidden');
    };
    const closeErrorModal = () => errorModal.classList.add('hidden');

    const switchToView = (viewName) => {
        dashboardView.classList.toggle('active', viewName === 'dashboard');
        questionView.classList.toggle('active', viewName === 'question');
    };

    const showCelebration = (title, message) => {
        celebrationTitle.textContent = title;
        celebrationMessage.innerHTML = message;
        celebrationEl.classList.remove('hidden');
        setTimeout(() => celebrationEl.classList.add('hidden'), 2500);
    };

    const displayDifficulty = (level) => {
        const numericLevel = parseInt(level, 10);
        if (isNaN(numericLevel) || !difficultyNumberEl || !difficultyStarsEl) return;
        
        difficultyNumberEl.textContent = `Lvl ${numericLevel}`;
        difficultyStarsEl.innerHTML = ''; // Clear existing stars
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star ${i <= numericLevel ? 'filled' : ''}`;
            difficultyStarsEl.appendChild(star);
        }
    };

    const updateAchievementsUI = (achievements) => {
        if (!achievementsListEl) return;
        achievementsListEl.innerHTML = ''; // Clear placeholders
        if (achievements.length === 0) {
            achievementsListEl.innerHTML = `<div class="achievement-placeholder"><i class="fas fa-trophy"></i><p>Answer questions to unlock achievements!</p></div>`;
            return;
        }
        achievements.forEach(ach => {
            const item = document.createElement('div');
            item.className = 'achievement-item';
            item.innerHTML = `<div class="achievement-icon"><i class="${ach.icon_class}"></i></div><div class="achievement-details"><h4>${ach.name}</h4><p>${ach.description}</p></div>`;
            achievementsListEl.appendChild(item);
        });
    };

    const getNextQuestion = async () => {
        showLoading('Preparing your personalized question...');
        try {
            const data = await apiFetch('/next_question', {
                method: 'POST',
                body: JSON.stringify({ lesson_id: lessonId })
            });
            currentQuestion = data;
            displayDifficulty(data.difficulty_level);
            questionTextEl.textContent = data.question_text;
            userAnswerTextarea.value = '';
            submitAnswerBtn.disabled = false;
            feedbackContainer.classList.add('hidden');
            switchToView('question');
        } catch (error) {
            showError(error.message);
        } finally {
            hideLoading();
        }
    };

    const submitAnswer = async () => {
        const userAnswer = userAnswerTextarea.value.trim();
        if (!userAnswer || !currentQuestion) return;
        showLoading('Analyzing your answer...');
        submitAnswerBtn.disabled = true;
        try {
            const result = await apiFetch('/submit_answer', {
                method: 'POST',
                body: JSON.stringify({
                    lesson_id: lessonId,
                    question_id: currentQuestion.question_id,
                    difficulty_answered: currentQuestion.difficulty_level,
                    user_answer: userAnswer,
                })
            });
            feedbackContainer.classList.remove('hidden', 'correct', 'incorrect');
            feedbackIcon.className = result.is_correct ? 'fas fa-check-circle' : 'fas fa-times-circle';
            feedbackContainer.classList.add(result.is_correct ? 'correct' : 'incorrect');
            feedbackTitle.textContent = result.is_correct ? 'Great job!' : 'Not quite';
            feedbackMessage.textContent = result.is_correct ? "That's the right idea!" : "That wasn't the answer we were looking for.";
            similarityScoreEl.textContent = `${Math.round(result.similarity_score * 100)}%`;
            if (result.is_correct) showCelebration('Correct!', `You earned +10 XP!`);
            if (result.quest_completed) setTimeout(() => showCelebration('Quest Complete!', `Awesome work!`), 1000);
        } catch (error) {
            showError(error.message);
            submitAnswerBtn.disabled = false;
        } finally {
            hideLoading();
        }
    };

    const loadInitialData = async () => {
        showLoading("Loading your dashboard...");
        try {
            const [stats, quest, achievements] = await Promise.all([
                apiFetch('/users/me/stats'),
                apiFetch('/quests/today'),
                apiFetch('/achievements')
            ]);
            if (usernameDisplay) usernameDisplay.textContent = username;
            if (xpCountEl) xpCountEl.textContent = stats.xp;
            if (streakCountEl) streakCountEl.textContent = stats.streak_count;
            if (questTitleEl) questTitleEl.textContent = quest.title;
            if (questContentEl) {
                if (quest.is_completed) {
                    questContentEl.innerHTML = `<div class="quest-placeholder"><i class="fas fa-check-circle" style="color: var(--success-color);"></i><h4>Quest Complete!</h4><p>Great job today. Feel free to practice more.</p></div>`;
                    if (nextQuestionBtn) nextQuestionBtn.textContent = 'Practice More';
                } else {
                    const progressPercent = (quest.current_progress / quest.completion_target) * 100;
                    questContentEl.innerHTML = `<p class="quest-description">${quest.description}</p><div class="progress-bar-container"><div class="progress-bar" style="width: ${progressPercent}%"></div></div><p class="quest-progress">${quest.current_progress} / ${quest.completion_target}</p>`;
                    if (nextQuestionBtn) nextQuestionBtn.textContent = 'Continue Quest';
                }
            }
            updateAchievementsUI(achievements);
        } catch (error) {
            showError(`Failed to load dashboard data: ${error.message}`);
        } finally {
            hideLoading();
        }
    };
    
    const applyAccessibilitySettings = () => {
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) rootEl.style.fontSize = savedFontSize;
    };
    const changeFontSize = (amount) => {
        const currentSize = parseFloat(getComputedStyle(rootEl).fontSize);
        const newSize = currentSize + amount;
        if (newSize >= 12 && newSize <= 24) {
            const newSizePx = `${newSize}px`;
            rootEl.style.fontSize = newSizePx;
            localStorage.setItem('fontSize', newSizePx);
        }
    };

    // --- Event Listeners ---
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', getNextQuestion);
    if (submitAnswerBtn) submitAnswerBtn.addEventListener('click', submitAnswer);
    if (skipQuestionBtn) skipQuestionBtn.addEventListener('click', getNextQuestion);
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', () => {
            loadInitialData(); // Refresh data when coming back to dashboard
            switchToView('dashboard');
        });
    }
    if (continueBtn) continueBtn.addEventListener('click', getNextQuestion);
    if (errorModalCloseBtn) errorModalCloseBtn.addEventListener('click', closeErrorModal);
    if (errorModalConfirmBtn) errorModalConfirmBtn.addEventListener('click', closeErrorModal);
    if (accessibilityToggleBtn) {
        accessibilityToggleBtn.addEventListener('click', () => {
            accessibilityPopup.classList.toggle('hidden');
            accessibilityToggleBtn.setAttribute('aria-expanded', String(!accessibilityPopup.classList.contains('hidden')));
        });
    }
    if (increaseFontBtn) increaseFontBtn.addEventListener('click', () => changeFontSize(1));
    if (decreaseFontBtn) decreaseFontBtn.addEventListener('click', () => changeFontSize(-1));

    // --- Onboarding State Variables ---
    let obStudentType = null;   // 'college' | 'competitive' | 'self_learner'
    let obSelectedSubjects = []; // string array, max 8
    let obDailyMinutes = 60;
    let obDisplayName = '';

    function updateStepper(currentStep) {
        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`ob-dot-${i}`);
            if (dot) {
                dot.classList.remove('ob-done', 'ob-active');
                if (i < currentStep) {
                    dot.classList.add('ob-done');
                    dot.textContent = '✓';
                } else if (i === currentStep) {
                    dot.classList.add('ob-active');
                    dot.textContent = i;
                } else {
                    dot.textContent = i;
                }
            }
        }
        for (let i = 1; i <= 3; i++) {
            const line = document.getElementById(`ob-line-${i}`);
            if (line) {
                line.classList.remove('ob-done');
                if (i < currentStep) {
                    line.classList.add('ob-done');
                }
            }
        }
    }

    function showStep(stepId) {
        document.querySelectorAll('.ob-step').forEach(step => {
            step.classList.remove('ob-step-active');
        });
        const el = document.getElementById(stepId);
        if (el) {
            el.classList.add('ob-step-active');
        }
    }

    function setupOnboardingListeners() {
        // --- Step 1: Name ---
        const nameInput = document.getElementById('ob-name-input');
        const next1 = document.getElementById('ob-next-1');
        if (nameInput && next1) {
            nameInput.addEventListener('input', () => {
                const val = nameInput.value.trim();
                next1.disabled = val.length < 2;
            });
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = nameInput.value.trim();
                    if (val.length >= 2) {
                        next1.click();
                    }
                }
            });
            next1.addEventListener('click', () => {
                obDisplayName = nameInput.value.trim();
                updateStepper(2);
                showStep('ob-step-2');
            });
        }

        // --- Step 2: Student Type ---
        const typeCards = document.querySelectorAll('.ob-type-card');
        const next2 = document.getElementById('ob-next-2');
        const back2 = document.getElementById('ob-back-2');
        
        typeCards.forEach(card => {
            card.addEventListener('click', () => {
                typeCards.forEach(c => c.classList.remove('ob-selected'));
                card.classList.add('ob-selected');
                obStudentType = card.dataset.type;
                if (next2) next2.disabled = false;
            });
        });

        if (next2) {
            next2.addEventListener('click', () => {
                updateStepper(3);
                if (obStudentType === 'college') showStep('ob-step-3-college');
                else if (obStudentType === 'competitive') showStep('ob-step-3-competitive');
                else if (obStudentType === 'self_learner') showStep('ob-step-3-self');
            });
        }
        if (back2) {
            back2.addEventListener('click', () => {
                updateStepper(1);
                showStep('ob-step-1');
            });
        }

        // --- Step 3A: College details ---
        const next3c = document.getElementById('ob-next-3c');
        const back3c = document.getElementById('ob-back-3c');
        if (next3c) {
            next3c.addEventListener('click', () => {
                updateStepper(4);
                showStep('ob-step-4-college');
            });
        }
        if (back3c) {
            back3c.addEventListener('click', () => {
                updateStepper(2);
                showStep('ob-step-2');
            });
        }

        // --- Step 3B: Competitive exam details ---
        const examInput = document.getElementById('ob-exam-input');
        const next3b = document.getElementById('ob-next-3b');
        const back3b = document.getElementById('ob-back-3b');
        const examChips = document.querySelectorAll('#ob-exam-chips .ob-chip');

        if (examInput && next3b) {
            examInput.addEventListener('input', () => {
                next3b.disabled = examInput.value.trim().length < 1;
            });
        }
        examChips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (examInput) {
                    examInput.value = chip.dataset.val;
                }
                examChips.forEach(c => c.classList.remove('ob-chip-selected'));
                chip.classList.add('ob-chip-selected');
                if (next3b) next3b.disabled = false;
            });
        });
        if (next3b) {
            next3b.addEventListener('click', () => {
                updateStepper(4);
                showStep('ob-step-4-competitive');
            });
        }
        if (back3b) {
            back3b.addEventListener('click', () => {
                updateStepper(2);
                showStep('ob-step-2');
            });
        }

        // --- Step 3C: Self learner details ---
        const topicInput = document.getElementById('ob-topic-input');
        const next3s = document.getElementById('ob-next-3s');
        const back3s = document.getElementById('ob-back-3s');
        const topicChips = document.querySelectorAll('#ob-topic-chips .ob-chip');
        const reasonChips = document.querySelectorAll('#ob-reason-chips .ob-chip');

        if (topicInput && next3s) {
            topicInput.addEventListener('input', () => {
                next3s.disabled = topicInput.value.trim().length < 1;
            });
        }
        topicChips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (topicInput) {
                    topicInput.value = chip.dataset.val;
                }
                topicChips.forEach(c => c.classList.remove('ob-chip-selected'));
                chip.classList.add('ob-chip-selected');
                if (next3s) next3s.disabled = false;
            });
        });
        reasonChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const wasSelected = chip.classList.contains('ob-chip-selected');
                reasonChips.forEach(c => c.classList.remove('ob-chip-selected'));
                if (!wasSelected) {
                    chip.classList.add('ob-chip-selected');
                }
                if (next3s) {
                    next3s.disabled = (topicInput && topicInput.value.trim().length < 1);
                }
            });
        });
        if (next3s) {
            next3s.addEventListener('click', () => {
                updateStepper(4);
                showStep('ob-step-4-self');
            });
        }
        if (back3s) {
            back3s.addEventListener('click', () => {
                updateStepper(2);
                showStep('ob-step-2');
            });
        }

        // --- Step 4A: College subjects ---
        const collegeSubjectChips = document.querySelectorAll('#ob-subject-chips .ob-chip');
        const next4c = document.getElementById('ob-next-4c');
        const back4c = document.getElementById('ob-back-4c');
        const subjectCustom = document.getElementById('ob-subject-custom');
        const subjectAddBtn = document.getElementById('ob-subject-add-btn');

        function updateCollegeNextState() {
            if (next4c) {
                next4c.disabled = obSelectedSubjects.length < 1;
            }
        }

        collegeSubjectChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const val = chip.dataset.val;
                const idx = obSelectedSubjects.indexOf(val);
                if (idx >= 0) {
                    obSelectedSubjects.splice(idx, 1);
                    chip.classList.remove('ob-chip-selected');
                } else {
                    if (obSelectedSubjects.length < 8) {
                        obSelectedSubjects.push(val);
                        chip.classList.add('ob-chip-selected');
                    }
                }
                updateCollegeNextState();
            });
        });

        if (subjectAddBtn && subjectCustom) {
            subjectAddBtn.addEventListener('click', () => {
                const val = subjectCustom.value.trim();
                if (val && obSelectedSubjects.length < 8 && !obSelectedSubjects.includes(val)) {
                    obSelectedSubjects.push(val);
                    const container = document.getElementById('ob-subject-chips');
                    if (container) {
                        const span = document.createElement('span');
                        span.className = 'ob-chip ob-chip-selected';
                        span.dataset.val = val;
                        span.textContent = val;
                        span.addEventListener('click', () => {
                            const idx = obSelectedSubjects.indexOf(val);
                            if (idx >= 0) {
                                obSelectedSubjects.splice(idx, 1);
                                span.classList.remove('ob-chip-selected');
                            } else {
                                if (obSelectedSubjects.length < 8) {
                                    obSelectedSubjects.push(val);
                                    span.classList.add('ob-chip-selected');
                                }
                            }
                            updateCollegeNextState();
                        });
                        container.appendChild(span);
                    }
                    subjectCustom.value = '';
                    updateCollegeNextState();
                }
            });
        }
        if (next4c) {
            next4c.addEventListener('click', () => {
                submitOnboarding();
            });
        }
        if (back4c) {
            back4c.addEventListener('click', () => {
                updateStepper(3);
                showStep('ob-step-3-college');
            });
        }

        // --- Step 4B: Competitive topics ---
        const competitiveChips = document.querySelectorAll('#ob-topic-area-chips .ob-chip');
        const next4b = document.getElementById('ob-next-4b');
        const back4b = document.getElementById('ob-back-4b');
        const topicCustom = document.getElementById('ob-topic-custom');
        const topicAddBtn = document.getElementById('ob-topic-add-btn');

        function updateCompetitiveNextState() {
            if (next4b) {
                next4b.disabled = obSelectedSubjects.length < 1;
            }
        }

        competitiveChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const val = chip.dataset.val;
                const idx = obSelectedSubjects.indexOf(val);
                if (idx >= 0) {
                    obSelectedSubjects.splice(idx, 1);
                    chip.classList.remove('ob-chip-selected');
                } else {
                    if (obSelectedSubjects.length < 8) {
                        obSelectedSubjects.push(val);
                        chip.classList.add('ob-chip-selected');
                    }
                }
                updateCompetitiveNextState();
            });
        });

        if (topicAddBtn && topicCustom) {
            topicAddBtn.addEventListener('click', () => {
                const val = topicCustom.value.trim();
                if (val && obSelectedSubjects.length < 8 && !obSelectedSubjects.includes(val)) {
                    obSelectedSubjects.push(val);
                    const container = document.getElementById('ob-topic-area-chips');
                    if (container) {
                        const span = document.createElement('span');
                        span.className = 'ob-chip ob-chip-selected';
                        span.dataset.val = val;
                        span.textContent = val;
                        span.addEventListener('click', () => {
                            const idx = obSelectedSubjects.indexOf(val);
                            if (idx >= 0) {
                                obSelectedSubjects.splice(idx, 1);
                                span.classList.remove('ob-chip-selected');
                            } else {
                                if (obSelectedSubjects.length < 8) {
                                    obSelectedSubjects.push(val);
                                    span.classList.add('ob-chip-selected');
                                }
                            }
                            updateCompetitiveNextState();
                        });
                        container.appendChild(span);
                    }
                    topicCustom.value = '';
                    updateCompetitiveNextState();
                }
            });
        }
        if (next4b) {
            next4b.addEventListener('click', () => {
                submitOnboarding();
            });
        }
        if (back4b) {
            back4b.addEventListener('click', () => {
                updateStepper(3);
                showStep('ob-step-3-competitive');
            });
        }

        // --- Step 4C: Self Learner goal ---
        const timeChips = document.querySelectorAll('#ob-time-chips .ob-chip');
        const next4s = document.getElementById('ob-next-4s');
        const back4s = document.getElementById('ob-back-4s');

        timeChips.forEach(chip => {
            chip.addEventListener('click', () => {
                timeChips.forEach(c => c.classList.remove('ob-chip-selected'));
                chip.classList.add('ob-chip-selected');
                obDailyMinutes = parseInt(chip.dataset.val);
            });
        });
        if (next4s) {
            next4s.addEventListener('click', () => {
                submitOnboarding();
            });
        }
        if (back4s) {
            back4s.addEventListener('click', () => {
                updateStepper(3);
                showStep('ob-step-3-self');
            });
        }

        // --- Skip and Done Buttons ---
        const skipBtn = document.getElementById('ob-skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', async () => {
                try {
                    await apiFetch('/onboarding', {
                        method: 'POST',
                        body: JSON.stringify({ student_type: null })
                    });
                } catch (e) {
                    console.error(e);
                } finally {
                    document.getElementById('ob-overlay').style.display = 'none';
                    loadInitialData();
                }
            });
        }

        const doneBtn = document.getElementById('ob-done-btn');
        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                document.getElementById('ob-overlay').style.display = 'none';
                loadInitialData();
            });
        }
    }

    async function submitOnboarding() {
        showLoading('Saving your preferences...');
        
        const collegeInput = document.getElementById('ob-college-input');
        const degreeInput = document.getElementById('ob-degree-input');
        const yearInput = document.getElementById('ob-year-input');
        const branchInput = document.getElementById('ob-branch-input');
        const examInput = document.getElementById('ob-exam-input');
        const examDateInput = document.getElementById('ob-examdate-input');
        const topicInput = document.getElementById('ob-topic-input');
        const goalInput = document.getElementById('ob-goal-input');
        const reasonChip = document.querySelector('#ob-reason-chips .ob-chip.ob-chip-selected');
        
        const payload = {
            display_name: obDisplayName,
            student_type: obStudentType,
            subjects: obSelectedSubjects,
            daily_minutes: obDailyMinutes,
            college_name: (collegeInput && collegeInput.value.trim()) || null,
            degree: (degreeInput && degreeInput.value) || null,
            study_year: (yearInput && yearInput.value) || null,
            branch: (branchInput && branchInput.value.trim()) || null,
            exam_name: (examInput && examInput.value.trim()) || null,
            exam_date: (examDateInput && examDateInput.value) || null,
            learning_topic: (topicInput && topicInput.value.trim()) || null,
            learning_goal: (goalInput && goalInput.value.trim()) || null,
            learning_reason: reasonChip ? reasonChip.dataset.val : null
        };

        try {
            await apiFetch('/onboarding', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (usernameDisplay) {
                usernameDisplay.textContent = obDisplayName;
            }
            const sbAv = document.getElementById('sb-avatar');
            const sbNm = document.getElementById('sb-name');
            if (sbAv) { sbAv.textContent = obDisplayName[0].toUpperCase(); }
            if (sbNm) { sbNm.textContent = obDisplayName; }

            showStep('ob-step-done');
            const doneNameSpan = document.getElementById('ob-done-name');
            if (doneNameSpan) {
                doneNameSpan.textContent = obDisplayName;
            }

            const summaryCard = document.getElementById('ob-summary-card');
            if (summaryCard) {
                if (obStudentType === 'college') {
                    summaryCard.innerHTML = `<div class="ob-summary-row">📖 <span>${obSelectedSubjects.length} subjects added</span></div>`;
                } else if (obStudentType === 'competitive') {
                    const examName = payload.exam_name;
                    let daysText = 'No date set';
                    if (payload.exam_date) {
                        const target = new Date(payload.exam_date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const diff = target - today;
                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                        daysText = `${days > 0 ? days : 0} days to go`;
                    }
                    summaryCard.innerHTML = `<div class="ob-summary-row">🎯 <span>${examName} &middot; ${daysText}</span></div>`;
                } else if (obStudentType === 'self_learner') {
                    summaryCard.innerHTML = `<div class="ob-summary-row">🌱 <span>Goal set &middot; ${obDailyMinutes / 60}hr/day</span></div>`;
                }
            }

            // Confetti
            const colors = ['#7C3AED','#6366F1','#F59E0B','#16A34A','#EF4444','#EC4899'];
            for (let i = 0; i < 60; i++) {
                const piece = document.createElement('div');
                piece.className = 'ob-confetti-piece';
                piece.style.left = `${Math.random() * 100}%`;
                piece.style.background = colors[i % colors.length];
                piece.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
                piece.style.animationDelay = `${Math.random() * 0.8}s`;
                document.body.appendChild(piece);
            }

            setTimeout(() => {
                document.querySelectorAll('.ob-confetti-piece').forEach(p => p.remove());
            }, 4000);

            setTimeout(() => {
                const doneBtn = document.getElementById('ob-done-btn');
                if (doneBtn) {
                    doneBtn.disabled = false;
                }
            }, 2000);

        } catch (err) {
            showError(err.message || 'An onboarding error occurred.');
        } finally {
            hideLoading();
        }
    }

    async function initOnboarding() {
        try {
            const status = await apiFetch('/onboarding/status');
            if (status.is_onboarded) {
                if (status.display_name && usernameDisplay) {
                    usernameDisplay.textContent = status.display_name;
                }
                const displayName = status.display_name || username;
                const sbAv = document.getElementById('sb-avatar');
                const sbNm = document.getElementById('sb-name');
                if (sbAv) { sbAv.textContent = displayName[0].toUpperCase(); }
                if (sbNm) { sbNm.textContent = displayName; }
                
                loadInitialData();
                return;
            }
            document.getElementById('ob-overlay').style.display = 'flex';
            setupOnboardingListeners();
        } catch (e) {
            loadInitialData();
        }
    }

    // --- Initial Load ---
    applyAccessibilitySettings();
    initOnboarding().then(() => {
        const sbName = localStorage.getItem('username') || '?';
        const sbAv = document.getElementById('sb-avatar');
        const sbNm = document.getElementById('sb-name');
        if (sbAv && !sbAv.textContent) { sbAv.textContent = sbName[0].toUpperCase(); }
        if (sbNm && !sbNm.textContent) { sbNm.textContent = sbName; }
    }).catch(() => loadInitialData());
});