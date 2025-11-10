import { useGetRecipesQuery } from './api/recipesApi'
import './App.css'

function App() {
  const { data: recipes, isLoading } = useGetRecipesQuery()

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Pantry Chef</h1>
          <p className="subtitle">AI-Powered Recipe Generator</p>
        </header>

        <div className="main-content">
          {isLoading ? (
            <div className="loading">Loading recipes</div>
          ) : recipes?.results && recipes.results.length > 0 ? (
            <div>
              <h2>Recipes</h2>
              <div className="recipes-list">
                {recipes.results.map((recipe) => (
                  <div key={recipe.id} className="recipe-item">
                    <h3>{recipe.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No recipes yet</h3>
              <p>Start by generating your first recipe!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

