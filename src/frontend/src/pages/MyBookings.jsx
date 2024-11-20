import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/constants';
import { getAuthToken } from '../utils/cookies';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`${API_BASE_URL}/booking/myBookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleViewFlight = (flightId) => {
        navigate(`/flight/${flightId}`);
    };

    const handleCancelClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!selectedBooking) return;

        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/booking/${selectedBooking.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            setBookings(bookings.filter(booking => booking.id !== selectedBooking.id));
            setShowModal(false);
            setSelectedBooking(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{`Error: ${error}`}</p>
    </div>;

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-tr from-purple-800 to-indigo-900 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold mb-8 text-center">My Bookings</h1>
                {bookings.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-300 text-lg">You have no bookings at the moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={`https://images.unsplash.com/photo-1437846972679-9e6e537be46e`}
                                    alt={`Flight ${booking.flightCode}`}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-2">Booking ID: {booking.id}</h2>
                                    <p className="text-gray-300 mb-1"><strong>Class:</strong> {booking.bookingClass}</p>
                                    <p className="text-gray-300 mb-1"><strong>Price:</strong> ${booking.price.toFixed(2)}</p>
                                    <p className="text-gray-300 mb-1"><strong>Status:</strong> {booking.status}</p>
                                    <p className="text-gray-300 mb-4"><strong>Booked On:</strong> {new Date(booking.bookedOn).toLocaleDateString()}</p>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleViewFlight(booking.flightCode)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                                        >
                                            View Flight
                                        </button>
                                        <button
                                            onClick={() => handleCancelClick(booking)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Confirmation Modal */}
                <AnimatePresence>
                    {showModal && selectedBooking && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white text-gray-800 rounded-lg p-8 w-11/12 max-w-md"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold mb-4">Confirm Cancellation</h2>
                                <p className="mb-4">Are you sure you want to cancel this booking?</p>
                                <div className="bg-gray-100 p-4 rounded mb-6">
                                    <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
                                    <p><strong>Class:</strong> {selectedBooking.bookingClass}</p>
                                    <p><strong>Price:</strong> ${selectedBooking.price.toFixed(2)}</p>
                                    <p><strong>Status:</strong> {selectedBooking.status}</p>
                                    <p><strong>Booked On:</strong> {new Date(selectedBooking.bookedOn).toLocaleDateString()}</p>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmCancel}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default MyBookings; 