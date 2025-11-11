"""
OpenAI service for generating recipes from ingredients.
"""
import json
import os
from openai import OpenAI
from django.conf import settings


def generate_recipe(ingredients_list):
    """
    Generate a recipe using OpenAI API based on provided ingredients.
    
    Args:
        ingredients_list: List of ingredient names (e.g., ["chicken", "tomatoes", "onions"])
    
    Returns:
        dict: Recipe data with title, description, cuisine_type, ingredients, instructions, 
              and cooking_time
    
    Raises:
        Exception: If OpenAI API call fails
    """
    api_key = os.getenv('OPENAI_API_KEY') or settings.OPENAI_API_KEY
    
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in environment variables")
    
    client = OpenAI(api_key=api_key)
    
    # Format ingredients list into a string
    ingredients_str = ", ".join(ingredients_list)
    
    # Create a prompt for recipe generation
    system_prompt = """
    # ROLE AND PERSONALITY
    You are Remy, a warm, encouraging, and highly intuitive chef. Your tone should be supportive, making the user feel confident in the kitchen, regardless of their skill level. Always offer positive encouragement.

    # RESPONSE FORMAT
    Generate detailed, delicious recipes based on the ingredients provided by the user.
    Your response MUST be VALID JSON format ONLY, and MUST NOT include any conversational text, markdown outside the JSON structure, or commentary.
    
    The JSON structure should be:
    {
        "title": "Recipe title",
        "description": "Brief description of the recipe",
        "cuisine_type": "one of: chinese, western, japanese, korean, italian, mexican, indian, thai, french, mediterranean, american",
        "ingredients": [
            {"name": "ingredient name", "quantity": "amount with unit"},
            ...
        ],
        "instructions": "Step-by-step cooking instructions as a numbered list or paragraph",
        "cooking_time": number (in minutes)
    }
    
    Important notes:
    - cuisine_type must be one of: chinese, western, japanese, korean, italian, mexican, indian, thai, french, mediterranean, american (lowercase)
    - ingredients should include ALL ingredients needed, auto-completed with common ingredients like salt, oil, spices that the user didn't mention
    - Make the recipe creative, practical, and delicious
    - Include all necessary steps and cooking tips
    - If the user provides fewer ingredients, suggest reasonable additions that are commonly available"""
    
    user_prompt = f"""I have these ingredients: {ingredients_str}. 
    Please provide a complete recipe with detailed instructions.
    Remember, I'm excited to cook! Provide the complete recipe now.
    Return only valid JSON."""
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        
        # Extract the content from the response
        content = response.choices[0].message.content.strip()
        
        # Try to parse JSON from the response
        # Sometimes OpenAI returns text with JSON, so we need to extract it
        try:
            # Try direct JSON parsing first
            recipe_data = json.loads(content)
        except json.JSONDecodeError as e:
            # If direct parsing fails, try to extract JSON from markdown code blocks
            raise Exception(f"Failed to parse OpenAI response as JSON after forced mode: {str(e)}")
        
        # Validate and structure the response
        valid_cuisine_types = ['chinese', 'western', 'japanese', 'korean', 'italian', 
                              'mexican', 'indian', 'thai', 'french', 'mediterranean', 
                              'american']
        
        cuisine_type = recipe_data.get("cuisine_type", "western").lower()
        if cuisine_type not in valid_cuisine_types:
            cuisine_type = "western"
        
        recipe = {
            "title": recipe_data.get("title", "Generated Recipe"),
            "description": recipe_data.get("description", ""),
            "cuisine_type": cuisine_type,
            "ingredients": recipe_data.get("ingredients", []),
            "instructions": recipe_data.get("instructions", ""),
            "cooking_time": recipe_data.get("cooking_time"),
        }
        
        # Ensure title is not empty
        if not recipe["title"] or recipe["title"].strip() == "":
            recipe["title"] = "Generated Recipe"
        
        # Ensure instructions is a string
        if not isinstance(recipe["instructions"], str):
            recipe["instructions"] = str(recipe["instructions"])
        
        # Ensure ingredients is a list
        if not isinstance(recipe["ingredients"], list):
            recipe["ingredients"] = []
        
        return recipe
        
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse OpenAI response as JSON: {str(e)}")
    except KeyError as e:
        raise Exception(f"Missing required field in OpenAI response: {str(e)}")
    except Exception as e:
        error_msg = str(e)
        if "API key" in error_msg or "authentication" in error_msg.lower():
            raise ValueError("Invalid OpenAI API key. Please check your API key in environment variables.")
        raise Exception(f"Failed to generate recipe: {error_msg}")

