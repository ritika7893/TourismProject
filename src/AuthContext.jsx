import { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [authError, setAuthError] = useState(null);

  const login = (data) => {
    const userObj = { mobile_number: data.mobile_number || 'Adventurer' };
    setUser(userObj);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
    
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    setAuthError(null);
  };

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

  const refreshAuthToken = useCallback(async () => {
    const tokenToUse = refreshToken || localStorage.getItem('refresh_token');
    if (!tokenToUse) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/refresh-token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: tokenToUse }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      
      if (data.status) {
        if (data.access_token) {
          setAccessToken(data.access_token);
          localStorage.setItem('access_token', data.access_token);
          
          // Handle new refresh token rotation if provided
          if (data.refresh_token) {
            setRefreshToken(data.refresh_token);
            localStorage.setItem('refresh_token', data.refresh_token);
          }
          console.log("Tokens successfully refreshed and reflected in LocalStorage.");
        } else {
          console.warn("Refresh API returned success but no access_token was found.");
        }
      } else {
        console.error("Token refresh rejected by server:", data.message);
        setAuthError(data.message || 'Your session has expired. Please login again.');
        logout();
      }
    } catch (error) {
      console.error("Network error during token refresh:", error);
      setAuthError('Connection lost. Please login again.');
      logout();
    }
  }, [refreshToken, logout]);

  // Use a ref to keep track of the refresh function without restarting the timer
  const refreshRef = useRef(refreshAuthToken);
  useEffect(() => {
    refreshRef.current = refreshAuthToken;
  }, [refreshAuthToken]);

  // Initial check and background auto-refresh
  useEffect(() => {
    // Refresh immediately on mount if we have a token to verify session
    if (user && !!refreshToken) {
      refreshRef.current();
    }

    let interval;
    if (user && !!refreshToken) {
      interval = setInterval(() => {
        refreshRef.current();
      }, 60000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user, !!refreshToken]); // Use !!refreshToken to only restart if it goes from null to string

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, refreshAuthToken, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};