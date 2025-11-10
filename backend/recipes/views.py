from rest_framework import viewsets
from .models import Recipe
from .serializers import RecipeSerializer


class RecipeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Recipe instances.
    TODO: Add your custom logic here
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

