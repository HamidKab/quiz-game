from django.test import TestCase
from django.urls import reverse

class APISmokeTest(TestCase):
    def test_questions_endpoint(self):
        resp = self.client.get('/api/questions/')
        self.assertEqual(resp.status_code, 200)
        # If your data is a list:
        self.assertTrue(len(resp.json()) >= 1)


from django.contrib.auth import get_user_model
import json

from .models import GameResult
from .serializers import GameResultSerializer


class GameResultModelTest(TestCase):
    def test_create_game_result(self):
        User = get_user_model()
        user = User.objects.create_user(username='tester', password='pass')
        gr = GameResult.objects.create(
            user=user,
            correct_answers=5,
            total_questions=10,
            time_taken=30.5,
            difficulty=GameResult.DIFFICULTY_MEDIUM,
            categories_list=['science', 'history'],
            mode=GameResult.MODE_TIMED,
        )
        self.assertEqual(gr.correct_answers, 5)
        self.assertEqual(gr.user.username, 'tester')
        self.assertTrue(hasattr(gr, 'played_at'))


class GameResultSerializerTest(TestCase):
    def test_serializer_valid_and_save(self):
        data = {
            "user": None,
            "correct_answers": 7,
            "total_questions": 10,
            "time_taken": 42.0,
            "difficulty": GameResult.DIFFICULTY_MEDIUM,
            "categories_list": ['history', 'science'],
            "mode": GameResult.MODE_TIMED,
        }
        serializer = GameResultSerializer(data=data)
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)
        obj = serializer.save()
        self.assertEqual(obj.correct_answers, 7)

    def test_serializer_invalid_negative_values(self):
        data = {
            "correct_answers": -1,
            "time_taken": -5.0,
            "difficulty": GameResult.DIFFICULTY_EASY,
            "mode": GameResult.MODE_TIMED,
        }
        serializer = GameResultSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('correct_answers', serializer.errors)
        self.assertIn('time_taken', serializer.errors)


class GameResultAPITest(TestCase):
    def test_get_games_list(self):
        GameResult.objects.create(
            correct_answers=3,
            total_questions=5,
            time_taken=20.0,
            difficulty=GameResult.DIFFICULTY_EASY,
            categories_list=['entertainment'],
            mode=GameResult.MODE_TIMED,
        )
        resp = self.client.get('/api/games/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) >= 1)

    def test_post_create_game_result(self):
        payload = {
            "user": None,
            "correct_answers": 4,
            "total_questions": 5,
            "time_taken": 33.0,
            "difficulty": GameResult.DIFFICULTY_EASY,
            "categories_list": ['sports', 'general'],
            "mode": GameResult.MODE_TIMED,
        }
        resp = self.client.post('/api/games/', data=json.dumps(payload), content_type='application/json')
        self.assertIn(resp.status_code, (200, 201))
        self.assertEqual(GameResult.objects.count(), 1)
