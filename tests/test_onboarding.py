import unittest
from unittest.mock import patch, MagicMock
from datetime import date
from fastapi import HTTPException

# Adjust relative import path based on pytest's path
from src.main import OnboardingSubmit, get_onboarding_status, complete_onboarding, get_subjects
from src.db_models import User

class TestOnboardingBackend(unittest.TestCase):
    def setUp(self):
        self.mock_user = User(id=42, username="test_onboard_user", email="test@studyflow.com", xp=100)

    @patch('src.main.get_db_connection')
    def test_get_onboarding_status_not_onboarded(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Simulate is_onboarded = False
        mock_cursor.fetchone.return_value = {"is_onboarded": False, "display_name": None}
        
        res = get_onboarding_status(current_user=self.mock_user)
        self.assertEqual(res, {"is_onboarded": False, "display_name": None})
        mock_cursor.execute.assert_called_once_with(
            "SELECT is_onboarded, display_name FROM users WHERE id = %s", (42,)
        )

    @patch('src.main.get_db_connection')
    def test_get_onboarding_status_onboarded(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Simulate is_onboarded = True
        mock_cursor.fetchone.return_value = {"is_onboarded": True, "display_name": "Aarush"}
        
        res = get_onboarding_status(current_user=self.mock_user)
        self.assertEqual(res, {"is_onboarded": True, "display_name": "Aarush"})

    @patch('src.main.get_db_connection')
    def test_complete_onboarding_college(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        data = OnboardingSubmit(
            display_name="Aarush",
            student_type="college",
            college_name="Delhi University",
            degree="B.Tech",
            study_year="1st Year",
            branch="Computer Science",
            subjects=["DSA", "DBMS"]
        )
        
        res = complete_onboarding(data=data, current_user=self.mock_user)
        self.assertEqual(res, {"success": True, "xp_earned": 50})
        
        # Verify psycopg2 connection calls
        mock_conn.commit.assert_called_once()
        mock_cursor.close.assert_called_once()

    @patch('src.main.get_db_connection')
    def test_complete_onboarding_competitive(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        data = OnboardingSubmit(
            display_name="Competitive Student",
            student_type="competitive",
            exam_name="GATE",
            exam_date=date(2026, 2, 1),
            subjects=["Maths", "CN"]
        )
        
        res = complete_onboarding(data=data, current_user=self.mock_user)
        self.assertEqual(res, {"success": True, "xp_earned": 50})
        mock_conn.commit.assert_called_once()

    @patch('src.main.get_db_connection')
    def test_complete_onboarding_self_learner(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        data = OnboardingSubmit(
            display_name="Self Learner",
            student_type="self_learner",
            learning_topic="Web Development",
            learning_goal="Build 3 projects",
            learning_reason="career",
            daily_minutes=120
        )
        
        res = complete_onboarding(data=data, current_user=self.mock_user)
        self.assertEqual(res, {"success": True, "xp_earned": 50})
        mock_conn.commit.assert_called_once()

    @patch('src.main.get_db_connection')
    def test_get_subjects(self, mock_get_db_connection):
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_get_db_connection.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        mock_cursor.fetchall.return_value = [
            {"id": 1, "name": "DSA", "color": "#7C3AED"},
            {"id": 2, "name": "DBMS", "color": "#6366F1"}
        ]
        
        res = get_subjects(current_user=self.mock_user)
        self.assertEqual(res, [
            {"id": 1, "name": "DSA", "color": "#7C3AED"},
            {"id": 2, "name": "DBMS", "color": "#6366F1"}
        ])
