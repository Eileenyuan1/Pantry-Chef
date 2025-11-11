from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Recipe
from .serializers import RecipeSerializer, IngredientInputSerializer
from .openai_service import generate_recipe
import logging

logger = logging.getLogger(__name__)


class RecipeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Recipe instances.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='generate')
    def generate(self, request):
        """
        Generate a recipe from a list of ingredients using OpenAI API.
        
        POST /api/recipes/generate/
        Request body: {"ingredients": ["chicken", "tomatoes", "onions"]}
        """
        serializer = IngredientInputSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ingredients = serializer.validated_data['ingredients']
        
        try:
            # Generate recipe using OpenAI
            recipe_data = generate_recipe(ingredients)
            
            # Save recipe to database
            recipe = Recipe.objects.create(
                title=recipe_data['title'],
                description=recipe_data.get('description', ''),
                cuisine_type=recipe_data.get('cuisine_type', 'western'),
                ingredients=recipe_data.get('ingredients', []),
                instructions=recipe_data.get('instructions', ''),
                cooking_time=recipe_data.get('cooking_time'),
                user_ingredients=', '.join(ingredients)
            )
            
            # Serialize and return the recipe
            response_serializer = RecipeSerializer(recipe)
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )
            
        except ValueError as e:
            logger.error(f"Configuration error: {str(e)}")
            return Response(
                {"error": "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Error generating recipe: {str(e)}")
            return Response(
                {"error": f"Failed to generate recipe: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

