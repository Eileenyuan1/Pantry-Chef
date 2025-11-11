from django.contrib import admin
from .models import Recipe


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ['title', 'cuisine_type', 'cooking_time', 'created_at']
    list_filter = ['created_at', 'cooking_time', 'cuisine_type']
    search_fields = ['title', 'description', 'user_ingredients']
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'cuisine_type', 'user_ingredients')
        }),
        ('Recipe Details', {
            'fields': ('ingredients', 'instructions', 'cooking_time')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at']

