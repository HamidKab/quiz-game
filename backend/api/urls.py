from django.urls import path
from . import views

urlpatterns = [
    path('questions/', views.questions_list, name='questions-list'),
    path('categories/', views.categories_list, name='categories-list'),
]