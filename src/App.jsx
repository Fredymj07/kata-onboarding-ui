import { useState } from 'react';
import React from 'react';

import AuthContext from './context/AuthContext.jsx';
import Login from './pages/login/Login.jsx';
import Onboarding from './components/Onboarding.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') ? true : false
  );
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  return (
    <>
      <AuthContext.Provider value={[isAuthenticated, setIsAuthenticated]}>
        {isAuthenticated ? <Onboarding /> : <Login />}
      </AuthContext.Provider>
    </>
  );
}

export default App;
