from django.urls import path
from . import views
from .views import GameResultListCreateAPIView, LeaderboardListEasyAPIView, LeaderboardListMediumAPIView, LeaderboardListHardAPIView

urlpatterns = [
    path('questions/', views.questions_list, name='questions-list'),
    path('categories/', views.categories_list, name='categories-list'),
    path("games/", GameResultListCreateAPIView.as_view(), name="game-results-listcreate"),
    path("games/leaderboard/easy/", views.LeaderboardListEasyAPIView.as_view(), name="leaderboard-easy"),
    path("games/leaderboard/medium/", views.LeaderboardListMediumAPIView.as_view(), name="leaderboard-medium"),
    path("games/leaderboard/hard/", views.LeaderboardListHardAPIView.as_view(), name="leaderboard-hard"),
]