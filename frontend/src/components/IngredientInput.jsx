import { useState } from 'react'
import { COMMON_INGREDIENTS } from '../data/commonIngredients'
import './IngredientInput.css'

function IngredientInput({ onGenerate, isLoading }) {
  const [ingredient, setIngredient] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [error, setError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Filter common ingredients based on user input
  const getSuggestions = () => {
    if (!ingredient.trim()) return []
    const searchTerm = ingredient.toLowerCase()
    return COMMON_INGREDIENTS.filter(ing => 
      ing.toLowerCase().includes(searchTerm)
    ).slice(0, 5) // Show max 5 suggestions
  }

  const handleAddIngredient = (ingredientToAdd = null) => {
    const trimmed = (ingredientToAdd || ingredient).trim()
    if (!trimmed) {
      setError('Please enter an ingredient')
      return
    }
    if (ingredients.includes(trimmed.toLowerCase())) {
      setError('This ingredient is already added')
      return
    }
    setIngredients([...ingredients, trimmed.toLowerCase()])
    setIngredient('')
    setError('')
    setShowSuggestions(false)
  }

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
    setError('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddIngredient()
    }
  }

  const handleGenerate = () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient')
      return
    }
    setError('')
    onGenerate(ingredients)
  }

  const handleClear = () => {
    setIngredients([])
    setIngredient('')
    setError('')
  }

  return (
    <div className="ingredient-input">
      <div className="ingredient-input-header">
        <h2>What's in your pantry?</h2>
        <p>Add ingredients you have, and Remy will create a delicious recipe!</p>
      </div>

      <div className="ingredient-input-form">
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => {
                setIngredient(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyPress={handleKeyPress}
              placeholder="Enter an ingredient (e.g., chicken, tomatoes)"
              disabled={isLoading}
              className="ingredient-input-field"
            />
            {showSuggestions && getSuggestions().length > 0 && (
              <div className="suggestions-dropdown">
                {getSuggestions().map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleAddIngredient(suggestion)
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleAddIngredient()}
            disabled={isLoading}
            className="add-button"
          >
            Add
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {ingredients.length > 0 && (
        <div className="ingredients-list">
          <div className="ingredients-tags">
            {ingredients.map((ing, index) => (
              <span key={index} className="ingredient-tag">
                {ing}
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={isLoading}
                  className="remove-button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="action-buttons">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="generate-button"
            >
              {isLoading ? 'Generating Recipe...' : 'Generate Recipe'}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="clear-button"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default IngredientInput

