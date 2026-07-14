import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AddMeal } from './pages/AddMeal';
import { Stats } from './pages/Stats';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { VerifyOTP } from './pages/VerifyOTP';
import { Onboarding } from './pages/Onboarding';
import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Force onboarding if they haven't completed it, unless they are already on the onboarding page
  if (!user?.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If they are onboarded, don't let them go back to the onboarding screen
  if (user?.onboarded && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/add-meal" element={<ProtectedRoute><AddMeal /></ProtectedRoute>} />
      <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
