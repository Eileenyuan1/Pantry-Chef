import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGenerateRecipeMutation } from '../api/recipesApi'
import IngredientInput from '../components/IngredientInput'
import '../App.css'

function HomePage() {
  const navigate = useNavigate()
  const [generateRecipe, { isLoading: isGenerating, error: generateError }] = useGenerateRecipeMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const handleGenerate = async (ingredients) => {
    try {
      setErrorMessage('')
      await generateRecipe(ingredients).unwrap()
      // Navigate to recipes page after successful generation
      navigate('/recipes')
    } catch (error) {
      setErrorMessage(
        error?.data?.error ||
        error?.data?.ingredients?.[0] ||
        'Failed to generate recipe. Please try again.'
      )
    }
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
        </div>
      </div>
    </div>
  )
}

export default HomePage
