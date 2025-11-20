import { useState } from 'react'
import { useGetRecipesQuery, useGenerateRecipeMutation } from './api/recipesApi'
import IngredientInput from './components/IngredientInput'
import './App.css'

function App() {
  const { data: recipes, isLoading: isLoadingRecipes, refetch } = useGetRecipesQuery()
  const [generateRecipe, { isLoading: isGenerating, error: generateError }] = useGenerateRecipeMutation()
  const [showInput, setShowInput] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const handleGenerate = async (ingredients) => {
    try {
      setErrorMessage('')
      await generateRecipe(ingredients).unwrap()
      setShowInput(false)
      // Refetch recipes to update the list
      refetch()
      // Scroll to recipes
      setTimeout(() => {
        const recipesSection = document.querySelector('.recipes-section')
        if (recipesSection) {
          recipesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (error) {
      setErrorMessage(
        error?.data?.error || 
        error?.data?.ingredients?.[0] || 
        'Failed to generate recipe. Please try again.'
      )
    }
  }

  const formatIngredients = (ingredients) => {
    if (Array.isArray(ingredients)) {
      return ingredients.map((ing, index) => {
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
    // If instructions are already formatted with line breaks, preserve them
    return instructions.split('\n').filter(line => line.trim())
  }

  const formatCuisineType = (cuisineType) => {
    if (!cuisineType) return ''
    // Convert snake_case to Title Case
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
          {/* Ingredient Input Section */}
          {showInput && (
            <div className="input-section">
              <IngredientInput 
                onGenerate={handleGenerate} 
                isLoading={isGenerating}
              />
              {errorMessage && (
                <div className="error-banner">
                  <strong>Error:</strong> {errorMessage}
                </div>
              )}
              {generateError && !errorMessage && (
                <div className="error-banner">
                  <strong>Error:</strong> Failed to generate recipe. Please check your API key and try again.
                </div>
              )}
            </div>
          )}

          {/* Recipes Section */}
          {!showInput && (
            <div className="recipes-section">
              {isLoadingRecipes ? (
                <div className="loading">Loading recipes...</div>
              ) : recipes?.results && recipes.results.length > 0 ? (
                <div>
                  <div className="recipes-header">
                    <h2>Generated Recipes</h2>
                    <button
                      onClick={() => setShowInput(true)}
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
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

