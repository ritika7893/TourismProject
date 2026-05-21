import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import UserDashboard from './UserDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

// Helper component to handle conditional layout logic inside the Router context
const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Function to determine if the main NavBar should be hidden (e.g., in Dashboard)
  const shouldHideNavBar = () => {
    return location.pathname.startsWith('/dashboard');
  };

  return (
    <div className="app-main-layout">
      {/* Conditionally render the main NavBar based on the function result */}
      {!shouldHideNavBar() && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
          </ProtectedRoute>
        } /> */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />

      <Route path="/UserDashboard" element={<UserDashboard />} />

      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
