import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Public Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Components
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import BasicPrediction from './pages/BasicPrediction';
import AdvancedPrediction from './pages/AdvancedPrediction';
import SymptomAnalyzer from './pages/SymptomAnalyzer';

// A wrapper to conditionally hide the Navbar on Auth pages or Dashboard (which has its own layout)
function PublicLayout({ children }) {
  const location = useLocation();
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {!hideNavbar && <Navbar />}
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/predict/basic" element={<BasicPrediction />} />
              <Route path="/predict/advanced" element={<AdvancedPrediction />} />
              <Route path="/analyze" element={<SymptomAnalyzer />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
