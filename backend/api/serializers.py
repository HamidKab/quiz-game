from rest_framework import serializers
from django.conf import settings
from .models import GameResult

class GameResultSerializer(serializers.ModelSerializer):
    # If you want the frontend to send a user id, leave this as a PrimaryKeyRelatedField.
    # Often better: make user read-only and set it from request.user in the view.
    # Make user read-only: the view will attach request.user in perform_create.
    # This avoids requiring a queryset here and keeps anonymous submissions possible.
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = GameResult
        fields = [
            "id",
            "user",
            "correct_answers",
            "total_questions",
            "time_taken",
            "difficulty",
            "mode",
            "categories_list",
            "played_at",
        ]
        read_only_fields = ["id", "played_at"]

    def validate_categories_list(self, value):
        """Ensure categories_list is a list (array)."""
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("categories_list must be an array of category IDs")
        return value

    def validate_correct_answers(self, value):
        if value < 0:
            raise serializers.ValidationError("correct_answers must be >= 0")
        return value

    def validate_time_taken(self, value):
        if value < 0:
            raise serializers.ValidationError("time_taken must be >= 0")
        return value

    def validate(self, attrs):
        total = attrs.get("total_questions")
        correct = attrs.get("correct_answers")
        if total is not None and correct is not None and correct > total:
            raise serializers.ValidationError("correct_answers cannot exceed total_questions")
        return attrs