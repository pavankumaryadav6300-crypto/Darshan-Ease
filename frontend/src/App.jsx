import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TempleDetails from './pages/TempleDetails';
import Bookings from './pages/Bookings';
import Donations from './pages/Donations';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/temple/:id" element={<TempleDetails />} />
              <Route path="/donations" element={<Donations />} />

              {/* Devotee Logged In Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['USER', 'ORGANIZER', 'ADMIN']} />}>
                <Route path="/bookings" element={<Bookings />} />
              </Route>

              {/* Admin/Organizer Dashboards Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']} />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
