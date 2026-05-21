import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import DashboardTopNav from './DashboardTopNav.jsx';

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
        <Route path="/dashboard" element={<DashboardTopNav />} />
        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="dashboard-layout" style={{ marginTop: shouldHideNavBar() ? '0px' : '70px' }}>
              <DashboardTopNav />
              <div className="dashboard-content" style={{ padding: '2rem' }}>
                <h1>Protected Dashboard</h1>
                <p>Welcome, {user?.mobile_number}! This is a secure area.</p>
              </div>
            </div>
          </ProtectedRoute>
        } /> */}
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
