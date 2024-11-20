import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_REGISTER_URL } from '../utils/constants';
import { PROJECT_NAME } from "../utils/constants";
import { FaUser, FaLock, FaEnvelope, FaUserCircle } from 'react-icons/fa';

const Register = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // First name validation
        if (!firstname.trim()) {
            newErrors.firstname = 'First name is required';
        }

        // Last name validation
        if (!lastname.trim()) {
            newErrors.lastname = 'Last name is required';
        }

        // Username validation
        if (username.length < 6) {
            newErrors.username = 'Username must be at least 6 characters long';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post(API_REGISTER_URL, {
                firstname,
                lastname,
                username,
                email,
                password
            });
            if (response.data.token) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519125323398-675f0ddb6308?&auto=format&fit=crop&w=1950&q=80)' }}>
            <div className="max-w-lg w-full bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-6">
                    <img
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?&auto=format&fit=crop&w=400&q=80"
                        alt="Register"
                        className="mx-auto h-32 w-auto rounded-full"
                    />
                    <h2 className="mt-4 text-4xl font-bold text-gray-800">Join {PROJECT_NAME}</h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Embark on your next adventure with us
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <FaUserCircle className="absolute top-3 left-3 text-gray-400" />
                            <input
                                id="firstname"
                                name="firstname"
                                type="text"
                                required
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstname ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="First Name"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                            {errors.firstname && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                            )}
                        </div>
                        <div className="relative">
                            <FaUserCircle className="absolute top-3 left-3 text-gray-400" />
                            <input
                                id="lastname"
                                name="lastname"
                                type="text"
                                required
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastname ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="Last Name"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                            {errors.lastname && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                            )}
                        </div>
                        <div className="relative">
                            <FaUser className="absolute top-3 left-3 text-gray-400" />
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        <div className="relative">
                            <FaLock className="absolute top-3 left-3 text-gray-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                        Register Now
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Social login section */}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or register with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center space-x-4">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                            <img className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                            <img className="w-5 h-5" src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                            <img className="w-5 h-5" src="https://www.svgrepo.com/show/475689/twitter-color.svg" alt="Twitter" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Register;
