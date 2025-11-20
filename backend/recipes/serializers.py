from rest_framework import serializers
from .models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    cuisine_type_display = serializers.CharField(source='get_cuisine_type_display', read_only=True)
    
    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ['created_at']


class IngredientInputSerializer(serializers.Serializer):
    """Serializer for ingredient input when generating recipes."""
    ingredients = serializers.ListField(
        child=serializers.CharField(),
        min_length=1,
        help_text="List of ingredient names"
    )
    cuisine_type = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Preferred cuisine type (optional)"
    )

