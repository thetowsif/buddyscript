import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/css/bootstrap.min.css'
import './assets/css/common.css'
import './assets/css/main.css'
import './assets/css/responsive.css'
import './assets/fonts/flaticon/flaticon.css'
import './assets/js/bootstrap.bundle.min.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
