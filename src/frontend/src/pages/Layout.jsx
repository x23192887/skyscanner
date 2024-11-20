import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import avatar from '../assets/clipart.png'
import icon from '../assets/flighter.png';
import { PROJECT_NAME } from "../utils/constants";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <header className="bg-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link to="/" className="flex items-center">
                <img src={icon} alt="Flighter Logo" className="h-10 mr-3 rounded-full" />
                <h1 className="text-3xl font-extrabold">{PROJECT_NAME}</h1>
              </Link>
              <button
                className="md:hidden text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  )}
                </svg>
              </button>
            </div>
            <nav className={`mt-4 md:mt-0 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
              <ul className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <li>
                  <Link to="/" className="text-lg hover:text-yellow-300 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/flights" className="text-lg hover:text-yellow-300 transition">
                    Flights
                  </Link>
                </li>
                {!user && (
                  <>
                    <li>
                      <Link to="/login" className="text-lg hover:text-yellow-300 transition">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-lg hover:text-yellow-300 transition">
                        Register
                      </Link>
                    </li>
                  </>
                )}
                {user && (
                  <li>
                    <Link to="/my-bookings" className="text-lg hover:text-yellow-300 transition">
                      My Bookings
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            {user && (
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="flex items-center">
                  <img
                    src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-yellow-400"
                  />
                  <span className="ml-2 text-lg font-semibold">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-yellow-500 hover:bg-yellow-600 text-indigo-800 font-bold py-2 px-4 rounded transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12">
        <Outlet />
      </main>

      <footer className="bg-indigo-800 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="text-2xl font-bold mb-4">{PROJECT_NAME}</h4>
              <p>Your gateway to the skies. Book your flights with ease and comfort.</p>
            </div>
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-semibold mb-3">Company</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-yellow-300 transition">About Us</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-300 transition">Careers</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-300 transition">Contact Us</a></li>
              </ul>
            </div>
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-yellow-300 transition">Privacy Policy</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-300 transition">Terms of Service</a></li>
                <li className="mb-2"><a href="#" className="hover:text-yellow-300 transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">Follow Us</h4>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-yellow-300 transition">Facebook</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition">Twitter</a></li>
                <li><a href="#" className="hover:text-yellow-300 transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} {PROJECT_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
