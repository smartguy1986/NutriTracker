import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'
import { NutritionProvider } from './context/NutritionContext'
import { AuthProvider } from './context/AuthContext'
import { FoodDatabaseProvider } from './context/FoodDatabaseContext'
import { ThemeProvider } from './context/ThemeContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <FoodDatabaseProvider>
              <NutritionProvider>
                <App />
              </NutritionProvider>
            </FoodDatabaseProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
