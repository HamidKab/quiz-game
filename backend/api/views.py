import json
import os
from django.http import JsonResponse
from django.conf import settings
from rest_framework import generics, permissions
from .models import GameResult
from .serializers import GameResultSerializer

DATA_DIR = os.path.join(settings.BASE_DIR, 'data')  # backend/data/

def _load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def questions_list(request):
    data = _load_json('questions.json')
    return JsonResponse(data, safe=False)

def categories_list(request):
    data = _load_json('categories.json')
    return JsonResponse(data, safe=False)

class GameResultListCreateAPIView(generics.ListCreateAPIView):
    queryset = GameResult.objects.all()
    serializer_class = GameResultSerializer
    permission_classes = [permissions.AllowAny]  # or IsAuthenticated

    def perform_create(self, serializer):
        # If you want to attach an authenticated user automatically:
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()