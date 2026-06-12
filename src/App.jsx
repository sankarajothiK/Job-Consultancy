import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobOpeningsPage from './pages/JobOpeningsPage';
import JobApplicationPage from './pages/JobApplicationPage';
import PlacementStatisticsPage from './pages/PlacementStatisticsPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Dashboard from './pages/admin/Dashboard';
import { Toaster } from 'react-hot-toast';

// Layout wrapper to conditionally show public Navbar/Footer
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/admin-login';

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-center" />
      
      {/* Show Navbar on public routes */}
      {!isAdminRoute && <Navbar />}

      {/* Main content area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job-openings" element={<JobOpeningsPage />} />
          <Route path="/job-application" element={<JobApplicationPage />} />
          <Route path="/placement-statistics" element={<PlacementStatisticsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Show Footer on public routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
