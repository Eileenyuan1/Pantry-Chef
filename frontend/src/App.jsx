import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RecipeListPage from './pages/RecipeListPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipeListPage />} />
      </Routes>
    </Router>
  )
}

export default App

