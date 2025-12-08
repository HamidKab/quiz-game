from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings

# Create your models here.
class GameResult(models.Model):
    DIFFICULTY_EASY = 'easy'
    DIFFICULTY_MEDIUM = 'medium'
    DIFFICULTY_HARD = 'hard'
    DIFFICULTY_CHOICES = [
        (DIFFICULTY_EASY, 'Easy'),
        (DIFFICULTY_MEDIUM, 'Medium'),
        (DIFFICULTY_HARD, 'Hard'),
    ]
    MODE_PRACTICE = 'practice'
    MODE_TIMED = 'timed'
    MODE_CHOICES = [
        (MODE_PRACTICE, 'Practice'),
        (MODE_TIMED, 'Timed'),
    ]
    CATEGORIES = [
        ('general', 'General Knowledge'),
        ('science', 'Science'),
        ('history', 'History'),
        ('sports', 'Sports'),
        ('entertainment', 'Entertainment'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='game_results',
        help_text='Optional link to the player (nullable to allow anonymous plays)'
        )
    correct_answers = models.PositiveIntegerField(
        validators=[MinValueValidator(0)],
        help_text='Number of correct answers in the game session'
        )
    total_questions = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Optional total questions in the game (useful to compute percentage)"
        )
    time_taken = models.FloatField(
        validators=[MinValueValidator(0.0)],
        help_text='Time taken to complete the game session in seconds'
        )
    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default=DIFFICULTY_MEDIUM,
        )
    mode = models.CharField(
        max_length=10,
        choices=MODE_CHOICES,
        default=MODE_PRACTICE,
        help_text='Indidcates whether the game was played in practice or timed mode'
        )
    categories_list = models.JSONField(
        default=list,
        blank=True,
        help_text='List of category IDs played in the game session'
        )
    played_at = models.DateTimeField(auto_now_add=True)
    player_name = models.CharField(
        max_length=100, 
        blank=True, null=True, 
        help_text='Optional player name for anonymous users'
        )

    class Meta:
        ordering = ['-played_at']
        verbose_name = 'Game Result'
        verbose_name_plural = 'Game Results'
    
    def __str__(self):
        user_repr = self.user.username if self.user else "Anonymous"
        return f"GameResult({user_repr}, {self.correct_answers}/{self.total_questions}, {self.difficulty}, {self.mode}, {self.played_at})"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.total_questions is not None and self.correct_answers > self.total_questions:
            raise ValidationError('Correct answers cannot exceed total questions.')
        
class LeaderboardEntry(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='leaderboard_entries',
        help_text='Optional link to the player (nullable to allow anonymous plays)'
    )
    correct_to_total_ratio = models.FloatField(
        default=0.0,
        help_text='Ratio of correct answers to total questions answered by the player'
    )
    time_taken = models.FloatField(
        validators=[MinValueValidator(0.0)],
        help_text='Total time taken across all games played by the player in seconds'
    )
    difficulty = models.CharField(
        max_length=10,
        choices=GameResult.DIFFICULTY_CHOICES,
        default=GameResult.DIFFICULTY_EASY,
    )
    player_name = models.CharField(
        max_length=100, 
        blank=True, null=True, 
        help_text='Optional player name for anonymous users'
    )


    class Meta:
        ordering = ['-correct_to_total_ratio', 'time_taken']
        verbose_name = 'Leaderboard Entry'
        verbose_name_plural = 'Leaderboard Entries'

    def __str__(self):
        user_repr = self.user.username if self.user else "Anonymous"
        return f"LeaderboardEntry({user_repr}, ratio={self.correct_to_total_ratio:.3f}, time={self.time_taken})"