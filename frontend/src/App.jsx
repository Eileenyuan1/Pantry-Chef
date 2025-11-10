import { useGetRecipesQuery } from './api/recipesApi'
import './App.css'

function App() {
  const { data: recipes, isLoading } = useGetRecipesQuery()

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <img 
              src="/remy-remi.gif" 
              alt="Remy's Cookbook" 
              className="header-image"
            />
            <h1 className="header-title">Remy's Cookbook</h1>
            <p className="subtitle">Find the magic in your pantry.</p>
          </div>
        </header>

        <div className="main-content">
          {isLoading ? (
            <div className="loading">Cooking up recipes...</div>
          ) : recipes?.results && recipes.results.length > 0 ? (
            <div>
              <h2>Today's Specials</h2>
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
              <div className="empty-state-icon">✨</div>
              <h3>A Chef's Intuition is Needed...</h3>
              <p>Tell Remy what's in your fridge, and he'll turn it into something amazing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

