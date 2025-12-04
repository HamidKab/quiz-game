import json
import os
from django.http import JsonResponse
from django.conf import settings
from django.db.models import F, FloatField, ExpressionWrapper, Case, When, Value
from rest_framework import generics, permissions
from .models import GameResult, LeaderboardEntry
from .serializers import (
    GameResultSerializer,
    LeaderboardEntrySerializer,
    LeaderboardGameResultSerializer,
)

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

class LeaderboardListEasyAPIView(generics.ListAPIView):
    # Annotate GameResult rows with accuracy (correct/total) and order by it then time
    queryset = (
        GameResult.objects.filter(difficulty=GameResult.DIFFICULTY_EASY)
        .annotate(
            correct_to_total_ratio=ExpressionWrapper(
                Case(
                    When(total_questions__gt=0, then=F('correct_answers') * 1.0 / F('total_questions')),
                    default=Value(0.0),
                    output_field=FloatField(),
                ),
                output_field=FloatField()
            )
        )
        .order_by('-correct_to_total_ratio', 'time_taken')[:10]
    )
    # Use serializer that can handle annotated GameResult instances
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # If you want to attach an authenticated user automatically:
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class LeaderboardListMediumAPIView(generics.ListAPIView):
    queryset = (
        GameResult.objects.filter(difficulty=GameResult.DIFFICULTY_MEDIUM)
        .annotate(
            correct_to_total_ratio=ExpressionWrapper(
                Case(
                    When(total_questions__gt=0, then=F('correct_answers') * 1.0 / F('total_questions')),
                    default=Value(0.0),
                    output_field=FloatField(),
                ),
                output_field=FloatField()
            )
        )
        .order_by('-correct_to_total_ratio', 'time_taken')[:10]
    )
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # If you want to attach an authenticated user automatically:
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class LeaderboardListHardAPIView(generics.ListAPIView):
    queryset = (
        GameResult.objects.filter(difficulty=GameResult.DIFFICULTY_HARD)
        .annotate(
            correct_to_total_ratio=ExpressionWrapper(
                Case(
                    When(total_questions__gt=0, then=F('correct_answers') * 1.0 / F('total_questions')),
                    default=Value(0.0),
                    output_field=FloatField(),
                ),
                output_field=FloatField()
            )
        )
        .order_by('-correct_to_total_ratio', 'time_taken')[:10]
    )
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # If you want to attach an authenticated user automatically:
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()