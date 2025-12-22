import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiStar,
  FiUser,
  FiMail,
  FiCalendar,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const ServiceDetails = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/${id}`
      );
      
      if (response.data) {
        setService(response.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a service");
      navigate("/login");
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a booking date");
      return;
    }

    
    if (service.providerEmail === user.email) {
      toast.error("You cannot book your own service");
      return;
    }

    setBookingLoading(true);

    try {
      const token = localStorage.getItem("access-token");
      const bookingData = {
        serviceId: id,
        serviceName: service.serviceName,
        serviceImage: service.imageUrl,
        userEmail: user.email,
        userName: user.displayName,
        providerEmail: service.providerEmail,
        providerName: service.providerName,
        price: service.price,
        bookingDate: bookingDate,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Service booked successfully!");
      setIsModalOpen(false);
      setBookingDate("");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to book service");
    } finally {
      setBookingLoading(false);
    }
  };

  
  if (loading) return <LoadingSpinner />;

  
  if (notFound) {
    return (
      <>
        <Helmet>
          <title>Service Not Found - HomeHero</title>
        </Helmet>
        <div
          className={`min-h-screen flex items-center justify-center px-4 ${
            theme === "dark" ? "bg-slate-900" : "bg-gray-50"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <span className="text-8xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                404
              </span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-8"
            >
              <div className="text-6xl">🔍❌</div>
            </motion.div>

            <h1
              className={`text-3xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Service Not Found
            </h1>
            <p
              className={`text-lg mb-8 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              The service you're looking for doesn't exist or has been removed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:scale-105"
              >
                Browse Services
              </Link>
              <button
                onClick={() => navigate(-1)}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  theme === "dark"
                    ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FiArrowLeft />
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  const isOwnService = user?.email === service?.providerEmail;

  return (
    <>
      <Helmet>
        <title>{service?.serviceName || "Service Details"} - HomeHero</title>
        <meta
          name="description"
          content={service?.description || "Service details on HomeHero"}
        />
      </Helmet>

      <div
        className={`min-h-screen py-8 ${
          theme === "dark" ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-4">
          
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  to="/"
                  className={`hover:text-primary-500 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className={theme === "dark" ? "text-gray-600" : "text-gray-400"}>
                /
              </li>
              <li>
                <Link
                  to="/services"
                  className={`hover:text-primary-500 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Services
                </Link>
              </li>
              <li className={theme === "dark" ? "text-gray-600" : "text-gray-400"}>
                /
              </li>
              <li
                className={`font-medium ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {service?.serviceName}
              </li>
            </ol>
          </nav>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl h-64 md:h-96">
              <img
                src={service?.imageUrl || "https://via.placeholder.com/800x400"}
                alt={service?.serviceName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400";
                }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div
                className={`rounded-2xl shadow-lg p-6 md:p-8 ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                }`}
              >
                
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1
                      className={`text-2xl md:text-3xl font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {service?.serviceName}
                    </h1>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          theme === "dark"
                            ? "bg-primary-900/30 text-primary-400"
                            : "bg-primary-100 text-primary-600"
                        }`}
                      >
                        {service?.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400 fill-current" />
                        <span
                          className={
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {service?.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <span
                          className={
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }
                        >
                          ({service?.reviews?.length || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="mb-8">
                  <h2
                    className={`text-xl font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Service Description
                  </h2>
                  <p
                    className={`leading-relaxed ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {service?.description}
                  </p>
                </div>

                
                <div className="mb-8">
                  <h2
                    className={`text-xl font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    What's Included
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Professional service by experienced provider",
                      "All necessary tools and equipment included",
                      "Satisfaction guaranteed or money back",
                      "Flexible scheduling available",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <FiCheck className="text-green-500 flex-shrink-0" />
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                
                <div>
                  <h2
                    className={`text-xl font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Customer Reviews
                  </h2>
                  {service?.reviews && service.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {service.reviews.map((review, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-semibold ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {review.userName || "Anonymous"}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`text-sm ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p
                            className={
                              theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }
                          >
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={
                        theme === "dark" ? "text-gray-500" : "text-gray-500"
                      }
                    >
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className={`rounded-2xl shadow-lg p-6 sticky top-24 ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div className="text-center mb-6">
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Service Price
                  </p>
                  <p className="text-4xl font-bold text-primary-500">
                    ${service?.price}
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    per service
                  </p>
                </div>

                {isOwnService ? (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
                  >
                    You can't book your own service
                  </button>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:scale-105"
                  >
                    Book Now
                  </button>
                )}

                
                <div
                  className={`mt-6 pt-6 border-t ${
                    theme === "dark" ? "border-slate-700" : "border-gray-200"
                  }`}
                >
                  <h3
                    className={`font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Service Provider
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUser
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      />
                      <span
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {service?.providerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMail
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }
                      />
                      <span
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {service?.providerEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl shadow-xl p-6 w-full max-w-md ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Book Service
            </h2>

            
            <div
              className={`p-4 rounded-lg mb-6 ${
                theme === "dark" ? "bg-slate-700" : "bg-gray-50"
              }`}
            >
              <h3
                className={`font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {service?.serviceName}
              </h3>
              <p className="text-primary-500 font-bold">${service?.price}</p>
            </div>

            
            <div className="space-y-4 mb-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className={`w-full px-4 py-2 rounded-lg cursor-not-allowed ${
                    theme === "dark"
                      ? "bg-slate-600 border-slate-500 text-gray-400"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Booking Date
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                    required
                  />
                </div>
              </div>
            </div>

            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setBookingDate("");
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  theme === "dark"
                    ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;