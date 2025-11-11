from django.db import models


class Recipe(models.Model):
    CUISINE_CHOICES = [
        ('chinese', 'Chinese'),
        ('western', 'Western'),
        ('japanese', 'Japanese'),
        ('korean', 'Korean'),
        ('italian', 'Italian'),
        ('mexican', 'Mexican'),
        ('indian', 'Indian'),
        ('thai', 'Thai'),
        ('french', 'French'),
        ('mediterranean', 'Mediterranean'),
        ('american', 'American'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, help_text="Brief description of the recipe")
    cuisine_type = models.CharField(
        max_length=50,
        choices=CUISINE_CHOICES,
        default='western',
        help_text="Type of cuisine"
    )
    ingredients = models.JSONField(
        default=list,
        help_text="Complete list of ingredients with quantities (auto-completed with common ingredients)"
    )
    user_ingredients = models.TextField(
        help_text="Original ingredients provided by the user",
        blank=True
    )
    instructions = models.TextField(help_text="Step-by-step cooking instructions")
    cooking_time = models.IntegerField(
        help_text="Cooking time in minutes",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Recipe'
        verbose_name_plural = 'Recipes'

    def __str__(self):
        return self.title

