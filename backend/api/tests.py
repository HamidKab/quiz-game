from django.test import TestCase
from django.urls import reverse

class APISmokeTest(TestCase):
    def test_questions_endpoint(self):
        resp = self.client.get('/api/questions/')
        self.assertEqual(resp.status_code, 200)
        # If your data is a list:
        self.assertTrue(len(resp.json()) >= 1)