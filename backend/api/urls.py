from django.urls import path
from . import views
from .views import GameResultListCreateAPIView

urlpatterns = [
    path('questions/', views.questions_list, name='questions-list'),
    path('categories/', views.categories_list, name='categories-list'),
    path("games/", GameResultListCreateAPIView.as_view(), name="game-results-listcreate"),
]