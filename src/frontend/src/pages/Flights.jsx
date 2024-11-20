import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_FLIGHT_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`${API_FLIGHT_URL}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        const data = await response.json();
        const fromAirport = searchParams.get('fromAirport');
        const toAirport = searchParams.get('toAirport');
        const departDate = searchParams.get('departDate');

        if (!fromAirport && !toAirport && !departDate) {
          const currentDate = new Date();
          const fiveDaysFromNow = new Date();
          fiveDaysFromNow.setDate(currentDate.getDate() + 2);

          const nextFiveDaysFlights = data.filter(flight => {
            const flightDate = new Date(flight.flyDate);
            return flightDate >= currentDate && flightDate <= fiveDaysFromNow;
          });

          setFlights(nextFiveDaysFlights);
          return;
        }

        const filteredFlights = data.filter(flight => {
          const flightDate = new Date(flight.flyDate);
          return (
            flight.fromAirport === decodeURIComponent(fromAirport) &&
            flight.toAirport === decodeURIComponent(toAirport) &&
            (departDate ? flightDate >= new Date(departDate) : true)
          );
        });

        setFlights(filteredFlights);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [location.search, searchParams]);

  const handleBookNow = (flightId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    navigate(`/flight/${flightId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-4xl font-extrabold text-center mb-12 text-indigo-700"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Discover Your Perfect Flight
      </motion.h1>
      {flights.length === 0 ? (
        <p className="text-center text-lg text-gray-700">No flights found matching your criteria.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {flights.map((flight) => (
            <motion.div
              key={flight.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={flight.images[0] || 'https://source.unsplash.com/collection/190727/800x600'}
                alt={flight.airline}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-2">{flight.airline}</h2>
                <div className="flex justify-between text-gray-700 mb-4">
                  <span><strong>From:</strong> {flight.fromAirport}</span>
                  <span><strong>To:</strong> {flight.toAirport}</span>
                </div>
                <div className="flex justify-between text-gray-700 mb-4">
                  <span><strong>Date:</strong> {new Date(flight.flyDate).toLocaleDateString()}</span>
                  <span><strong>Duration:</strong> {flight.duration}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-green-600">${flight.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleBookNow(flight.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Book Now
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">Features:</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {flight.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-indigo-600 text-white text-center py-2">
                <a onClick={() => handleBookNow(flight.id)} className="text-sm hover:underline">
                  View More Details
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Flights;
