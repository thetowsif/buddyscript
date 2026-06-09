import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
