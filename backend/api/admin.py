from django.contrib import admin
from .models import GameResult
from .models import LeaderboardEntry

# Register your models here.
@admin.register(GameResult)
class GameResultAdmin(admin.ModelAdmin):
    """Admin for GameResult model: show key fields and provide filtering options."""
    list_display = (
        'user',
        'correct_answers',
        'total_questions',
        'time_taken',
        'difficulty',
        'mode',
        'categories_list',
        'played_at',
    )
    list_filter = ('difficulty', 'mode', 'played_at')
    search_fields = ('user__username',)
    ordering = ('-played_at',)

@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    """Admin for Leaderboard model: show key fields and provide filtering options."""
    list_display = (
        'player_name',
        'user',
        'correct_to_total_ratio',
        'time_taken',   
    )
    list_filter = ('correct_to_total_ratio', 'time_taken')
    search_fields = ('user__username',)
    ordering = ('-correct_to_total_ratio', 'time_taken')