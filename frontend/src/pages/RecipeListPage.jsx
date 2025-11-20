import { useNavigate } from 'react-router-dom'
import { useGetRecipesQuery } from '../api/recipesApi'
import '../App.css'

function RecipeListPage() {
  const navigate = useNavigate()
  const { data: recipes, isLoading: isLoadingRecipes } = useGetRecipesQuery()

  const formatIngredients = (ingredients) => {
    if (Array.isArray(ingredients)) {
      return ingredients.map((ing) => {
        if (typeof ing === 'object' && ing.name && ing.quantity) {
          return `${ing.quantity} ${ing.name}`
        }
        return typeof ing === 'string' ? ing : JSON.stringify(ing)
      })
    }
    return []
  }

  const formatInstructions = (instructions) => {
    if (!instructions) return ''
    return instructions.split('\n').filter(line => line.trim())
  }

  const formatCuisineType = (cuisineType) => {
    if (!cuisineType) return ''
    return cuisineType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <img
              src="/images/header-image.jpg"
              alt="Remy's Cookbook"
              className="header-image"
            />
            <h1 className="header-title">Remy's Cookbook</h1>
            <p className="subtitle">A Chef's Intuition is Needed...</p>
          </div>
        </header>

        <div className="main-content">
          <div className="recipes-section">
            {isLoadingRecipes ? (
              <div className="loading">Loading recipes...</div>
            ) : recipes?.results && recipes.results.length > 0 ? (
              <div>
                <div className="recipes-header">
                  <h2>Generated Recipes</h2>
                  <button
                    onClick={() => navigate('/')}
                    className="new-recipe-button"
                  >
                    Generate New Recipe
                  </button>
                </div>
                <div className="recipes-list">
                  {recipes.results.map((recipe) => (
                    <div key={recipe.id} className="recipe-card">
                      <div className="recipe-header">
                        <h3 className="recipe-title">{recipe.title}</h3>
                        <div className="recipe-meta">
                          {recipe.cuisine_type && (
                            <span className="meta-item cuisine-badge">
                              🍽️ {recipe.cuisine_type_display || formatCuisineType(recipe.cuisine_type)}
                            </span>
                          )}
                          {recipe.cooking_time && (
                            <span className="meta-item">
                              ⏱️ {recipe.cooking_time} min
                            </span>
                          )}
                        </div>
                      </div>

                      {recipe.description && (
                        <p className="recipe-description">{recipe.description}</p>
                      )}

                      {recipe.user_ingredients && (
                        <div className="user-ingredients">
                          <strong>Your ingredients:</strong> {recipe.user_ingredients}
                        </div>
                      )}

                      {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div className="recipe-section">
                          <h4 className="section-title">Ingredients</h4>
                          <ul className="ingredients-list">
                            {formatIngredients(recipe.ingredients).map((ingredient, index) => (
                              <li key={index}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {recipe.instructions && (
                        <div className="recipe-section">
                          <h4 className="section-title">Instructions</h4>
                          <div className="instructions">
                            {formatInstructions(recipe.instructions).map((step, index) => (
                              <div key={index} className="instruction-step">
                                {step.trim() && (
                                  <>
                                    {step.match(/^\d+[\.\)]/) ? (
                                      <p>{step}</p>
                                    ) : (
                                      <p><strong>{index + 1}.</strong> {step}</p>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="loading">
                <p>No recipes yet. Generate your first recipe!</p>
                <button
                  onClick={() => navigate('/')}
                  className="new-recipe-button"
                  style={{ marginTop: '20px' }}
                >
                  Generate Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeListPage
