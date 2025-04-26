// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store' // Import the configured store
import App from './App.tsx'
import './index.css' // Import Tailwind CSS styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> {/* Wrap App with Redux Provider */}
      <App />
    </Provider>
  </React.StrictMode>,
)