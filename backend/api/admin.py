from django.contrib import admin
from .models import GameResult

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
        'played_at',
    )
    list_filter = ('difficulty', 'mode', 'played_at')
    search_fields = ('user__username',)
    ordering = ('-played_at',)