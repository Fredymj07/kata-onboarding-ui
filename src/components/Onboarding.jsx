import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from '../components/Navbar.jsx';
import Login from '../pages/login/Login.jsx';
import Users from './Users.jsx';
import OnboardingManager from './OnboardingManager.jsx';
import OnboardingAssign from './OnboardingAssign.jsx';

const Onboarding = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />} />
        <Route path="/onboarding" element={<OnboardingManager />} />
        <Route path="/assign-onboarding" element={<OnboardingAssign />} />
      </Routes>
    </Router>
  );
};

export default Onboarding;
