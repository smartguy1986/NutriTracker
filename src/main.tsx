import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { NutritionProvider } from './context/NutritionContext'
import { AuthProvider } from './context/AuthContext'
import { FoodDatabaseProvider } from './context/FoodDatabaseContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <FoodDatabaseProvider>
            <NutritionProvider>
              <App />
            </NutritionProvider>
          </FoodDatabaseProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
