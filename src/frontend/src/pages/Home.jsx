import React, { useState, useEffect } from "react";
import { FaPlane, FaSearch, FaHeart } from 'react-icons/fa';
import { API_MASTER_DATA_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedAirport, setSelectedAirport] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDestinationAirport, setSelectedDestinationAirport] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_MASTER_DATA_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCountryChange = (e) => {
    const country = data.countries.find(c => c.countryName === e.target.value);
    setSelectedCountry(country ? country.countryId : "");
    setSelectedAirport("");
  };

  const handleAirportChange = (e) => {
    setSelectedAirport(e.target.value);
  };

  const handleDestinationChange = (e) => {
    const country = data.countries.find(c => c.countryName === e.target.value);
    setSelectedDestination(country ? country.countryId : "");
    setSelectedDestinationAirport("");
  };

  const handleDestinationAirportChange = (e) => {
    setSelectedDestinationAirport(e.target.value);
  };

  const fromAirports = selectedCountry && data ? data.countries.find(country => country.countryId === selectedCountry)?.airportsList : [];
  const toAirports = selectedDestination && data ? data.countries.find(country => country.countryId === selectedDestination)?.airportsList : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      fromCountry: selectedCountry,
      fromAirport: selectedAirport,
      toCountry: selectedDestination,
      toAirport: selectedDestinationAirport,
      departDate: document.getElementById('depart').value,
      passengers: document.getElementById('passengers').value
    });
    navigate(`/flights?${searchParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="text-2xl text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-96 flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558204692-5f402fe220b9')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">Fly High with Us</h1>
          <p className="text-lg md:text-2xl text-gray-300">Discover amazing destinations at unbeatable prices</p>
        </div>
      </section>

      {/* Flight Search Form */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center mb-6">
              <FaSearch className="text-2xl text-indigo-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">Search Flights</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">From Country</label>
                  <select
                    id="country"
                    value={selectedCountry ? data?.countries.find(c => c.countryId === selectedCountry)?.countryName : ""}
                    onChange={handleCountryChange}
                    className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                  >
                    <option value="">Select a country</option>
                    {data && data.countries.map(country => (
                      <option key={country.countryId} value={country.countryName}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="airport" className="block text-sm font-medium text-gray-700">Airport</label>
                  <select
                    id="airport"
                    value={selectedAirport}
                    onChange={handleAirportChange}
                    className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    disabled={!selectedCountry}
                  >
                    <option value="">Select an airport</option>
                    {fromAirports.map(airport => (
                      <option key={airport.airportId} value={airport.airportName}>
                        {airport.airportName} ({airport.airportCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">To Destination</label>
                  <select
                    id="destination"
                    value={selectedDestination ? data.countries.find(c => c.countryId === selectedDestination)?.countryName : ""}
                    onChange={handleDestinationChange}
                    className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                  >
                    <option value="">Select a destination</option>
                    {data && data.countries.map(country => (
                      <option key={country.countryId} value={country.countryName}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="destination-airport" className="block text-sm font-medium text-gray-700">Destination Airport</label>
                  <select
                    id="destination-airport"
                    value={selectedDestinationAirport}
                    onChange={handleDestinationAirportChange}
                    className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    disabled={!selectedDestination}
                  >
                    <option value="">Select a destination airport</option>
                    {toAirports.map(airport => (
                      <option key={airport.airportId} value={airport.airportName}>
                        {airport.airportName} ({airport.airportCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="depart" className="block text-sm font-medium text-gray-700">Depart Date</label>
                  <input
                    type="date"
                    id="depart"
                    className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Passengers</label>
                  <select
                    id="passengers"
                    className="mt-1 block w-full border border-indigo-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    required
                  >
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>3 Adults</option>
                    <option>4 Adults</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-6 py-3 rounded-md hover:bg-indigo-600 transition duration-300 flex items-center"
                >
                  <FaPlane className="mr-2" />
                  Search Flights
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800">Why Choose Us</h2>
            <p className="text-gray-600 mt-2">We offer the best flight deals tailored just for you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://plus.unsplash.com/premium_photo-1661962354730-cda54fa4f9f1"
                alt="Best Prices"
                className="mb-4 w-24 h-24 object-cover rounded-full"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitive Prices</h3>
              <p className="text-gray-600">Get the best prices on flights worldwide.</p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1615561916422-7014e1078997"
                alt="24/7 Support"
                className="mb-4 w-24 h-24 object-cover rounded-full"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our support team is here to help you anytime.</p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://plus.unsplash.com/premium_photo-1661512529377-ef82f19bf9f8"
                alt="Secure Booking"
                className="mb-4 w-24 h-24 object-cover rounded-full"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your transactions are safe with our secure systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800">Popular Destinations</h2>
            <p className="text-gray-600 mt-2">Explore our most booked destinations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Destination 1 */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"
                alt="New York"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-white p-4">
                <h3 className="text-xl font-semibold">New York</h3>
                <p className="text-sm">USA</p>
              </div>
            </div>
            {/* Destination 2 */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://plus.unsplash.com/premium_photo-1718035557075-5111d9d906d2"
                alt="Paris"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-white p-4">
                <h3 className="text-xl font-semibold">Paris</h3>
                <p className="text-sm">France</p>
              </div>
            </div>
            {/* Destination 3 */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d"
                alt="Tokyo"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-white p-4">
                <h3 className="text-xl font-semibold">Tokyo</h3>
                <p className="text-sm">Japan</p>
              </div>
            </div>
            {/* Destination 4 */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9"
                alt="Sydney"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-60 w-full text-white p-4">
                <h3 className="text-xl font-semibold">Sydney</h3>
                <p className="text-sm">Australia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800">What Our Customers Say</h2>
            <p className="text-gray-600 mt-2">Trusted by thousands of happy travelers.</p>
          </div>
          <div className="space-y-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex">
              <FaHeart className="text-red-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-700 italic">"Booking my flight was seamless and hassle-free. Highly recommend!"</p>
                <p className="mt-2 text-gray-900 font-semibold">- Emily R.</p>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex">
              <FaHeart className="text-red-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-700 italic">"Amazing prices and excellent customer service. I'll fly again!"</p>
                <p className="mt-2 text-gray-900 font-semibold">- Michael S.</p>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex">
              <FaHeart className="text-red-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-700 italic">"A reliable platform with a great selection of flights. Very satisfied."</p>
                <p className="mt-2 text-gray-900 font-semibold">- Sophia L.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Ready to Book Your Next Flight?</h2>
          <p className="text-white mb-6">Join thousands of satisfied travelers and find the best deals today.</p>
          <button
            onClick={() => navigate('/flights')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Browse Flights
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
