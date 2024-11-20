import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { API_FLIGHT_URL, API_BOOKING_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { getAuthToken } from '../utils/cookies';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FlightDetails = () => {
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState('Economy');
    const { flightId } = useParams();
    const { user } = useAuth();
    const [bookingStatus, setBookingStatus] = useState(null);
    const navigate = useNavigate();

    const getClassPriceMultiplier = (classType) => {
        switch (classType) {
            case 'Business':
                return 2.5;
            case 'First Class':
                return 4;
            default:
                return 1;
        }
    };

    useEffect(() => {
        const fetchFlightDetails = async () => {
            try {
                const response = await fetch(`${API_FLIGHT_URL}/${flightId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch flight details');
                }
                const data = await response.json();
                setFlight(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFlightDetails();
    }, [flightId]);

    const handleBooking = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const bookingData = {
                flightCode: flightId,
                price: flight.price * getClassPriceMultiplier(selectedClass),
                bookingClass: selectedClass,
                status: 'pending',
                bookedBy: user.username,
            };

            const response = await fetch(API_BOOKING_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error('Booking failed');
            }

            setBookingStatus('success');

            setTimeout(() => {
                navigate('/my-bookings');
            }, 2000);

        } catch (err) {
            setBookingStatus('error');
            console.error('Booking error:', err);
        }
    };


    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
    if (!flight) return <div className="text-center py-8">Flight not found</div>;

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto px-6 py-12">
                <div className="bg-gray-700 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Image Carousel */}
                    <div className="w-full h-96">
                        <Carousel
                            showArrows={true}
                            showStatus={false}
                            showThumbs={true}
                            infiniteLoop={true}
                            autoPlay={true}
                            interval={7000}
                            className="h-full"
                        >
                            {flight.images.map((image, index) => (
                                <div key={index} className="h-96">
                                    <img
                                        src={image}
                                        alt={`Flight ${index + 1}`}
                                        className="object-cover h-full w-full transition-transform duration-500 transform hover:scale-105"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>

                    {/* Flight Details */}
                    <div className="p-8 pt-24">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                            <h1 className="text-4xl font-bold text-yellow-400">{flight.airline} Airways</h1>
                            <div className="flex items-center mt-4 md:mt-0">
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="bg-gray-600 text-yellow-400 border border-yellow-400 rounded-md px-4 py-2 mr-4 focus:outline-none"
                                >
                                    <option value="Economy">Economy</option>
                                    <option value="Business">Business</option>
                                    <option value="First Class">First Class</option>
                                </select>
                                <span className="text-3xl font-extrabold">
                                    ${(flight.price * getClassPriceMultiplier(selectedClass)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div>
                                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Flight Information</h2>
                                <ul className="space-y-3">
                                    <li><strong>From:</strong> {flight.fromAirport}</li>
                                    <li><strong>To:</strong> {flight.toAirport}</li>
                                    <li><strong>Date:</strong> {new Date(flight.flyDate).toLocaleDateString()}</li>
                                    <li><strong>Duration:</strong> {flight.duration}</li>
                                    <li>
                                        <strong>Status:</strong>
                                        <span className={`ml-2 font-semibold ${flight.status === 'AVAILABLE' ? 'text-green-400' : 'text-red-400'}`}>
                                            {flight.status}
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">Features</h2>
                                <ul className="space-y-3">
                                    {flight.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="w-6 h-6 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {flight.status === 'AVAILABLE' && (
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={handleBooking}
                                    disabled={!user}
                                    className={`w-full md:w-1/2 ${user ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-500 cursor-not-allowed'
                                        } text-gray-800 py-3 px-6 rounded-full font-bold transition duration-300`}
                                >
                                    {user ? 'Book This Flight' : 'Please login to book'}
                                </button>
                                {bookingStatus === 'success' && (
                                    <motion.p
                                        className="text-green-400 mt-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        Booking successful! Redirecting...
                                    </motion.p>
                                )}
                                {bookingStatus === 'error' && (
                                    <motion.p
                                        className="text-red-400 mt-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        Booking failed. Please try again.
                                    </motion.p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FlightDetails; 