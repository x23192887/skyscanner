import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightDetails from './pages/FlightDetails';
import { AuthProvider } from './context/AuthContext';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flight/:flightId" element={<FlightDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
