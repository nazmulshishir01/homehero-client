import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiDollarSign,
  FiTag,
  FiStar,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ServiceDetails = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");

  useEffect(() => {
    console.log("Service ID from params:", id);
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${import.meta.env.VITE_API_URL}/services/${id}`;
      console.log("Fetching from URL:", url);

      const response = await axios.get(url);
      console.log("Service details response:", response.data);

      if (response.data) {
        setService(response.data);
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load service details",
      );

      
      if (error.response?.status === 404) {
        toast.error("Service not found");
        navigate("/services");
      } else {
       
        setService({
          _id: id,
          serviceName: "Professional House Cleaning",
          category: "Cleaning",
          price: 50,
          description:
            "Get your home sparkling clean with our professional cleaning service. Our experienced team uses eco-friendly products and modern equipment to ensure your home is not just clean, but healthy too. We cover all areas including living rooms, bedrooms, kitchen, and bathrooms.",
          imageUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
          providerName: "John Doe",
          providerEmail: "provider@example.com",
          averageRating: 4.5,
          reviews: [
            {
              userName: "Alice Smith",
              rating: 5,
              comment: "Excellent service!",
              date: new Date(),
            },
            {
              userName: "Bob Johnson",
              rating: 4,
              comment: "Very professional",
              date: new Date(),
            },
          ],
        });
        toast.error("Using sample data - API connection failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book a service");
      navigate("/login", { state: { from: `/services/${id}` } });
      return;
    }

    
    if (user.email === service.providerEmail) {
      toast.error("You can't book your own service!");
      return;
    }

    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
    if (!bookingDate) {
      toast.error("Please select a booking date");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingDate);

    if (selectedDate < today) {
      toast.error("Please select a future date");
      return;
    }

    try {
      const token = localStorage.getItem("access-token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const bookingData = {
        userEmail: user.email,
        userName: user.displayName || "Customer",
        serviceId: service._id,
        serviceName: service.serviceName,
        providerEmail: service.providerEmail,
        providerName: service.providerName,
        bookingDate: bookingDate,
        price: service.price,
        status: "pending",
      };

      console.log("Booking data:", bookingData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Booking response:", response.data);

      setShowBookingModal(false);

      Swal.fire({
        title: "Success!",
        text: "Service booked successfully",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      }).then(() => {
        navigate("/my-bookings");
      });
    } catch (error) {
      console.error("Booking error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to book service. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Service
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/services"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Service not found
          </h2>
          <Link
            to="/services"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{service.serviceName} - HomeHero</title>
        <meta name="description" content={service.description} />
      </Helmet>

      <div
        className={`min-h-screen py-8 ${
          theme === "dark" ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-4">
        
          <nav
            className={`flex items-center gap-2 text-sm mb-6 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <Link
              to="/"
              className={`hover:${
                theme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            >
              Home
            </Link>
            <span
              className={theme === "dark" ? "text-gray-600" : "text-gray-400"}
            >
              /
            </span>
            <Link
              to="/services"
              className={`hover:${
                theme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            >
              Services
            </Link>
            <span
              className={theme === "dark" ? "text-gray-600" : "text-gray-400"}
            >
              /
            </span>
            <span
              className={theme === "dark" ? "text-gray-200" : "text-gray-900"}
            >
              {service.serviceName}
            </span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg shadow-xl overflow-hidden ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            
            <div
              className={`h-64 md:h-96 ${
                theme === "dark" ? "bg-slate-700" : "bg-gray-200"
              }`}
            >
              <img
                src={service.imageUrl || "https://via.placeholder.com/800x400"}
                alt={service.serviceName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=Service+Image";
                }}
              />
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-8">
                
                <div className="md:col-span-2 space-y-6">
                  
                  <div>
                    <h1
                      className={`text-3xl font-bold mb-3 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {service.serviceName}
                    </h1>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          theme === "dark"
                            ? "bg-blue-900/30 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`${
                              i < Math.floor(service.averageRating || 4.5)
                                ? "text-yellow-400 fill-current"
                                : theme === "dark"
                                  ? "text-gray-600"
                                  : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span
                          className={`ml-2 text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {service.averageRating?.toFixed(1) || "4.5"} (
                          {service.reviews?.length || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  
                  <div>
                    <h2
                      className={`text-xl font-semibold mb-3 ${
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
                      {service.description}
                    </p>
                  </div>

                  
                  <div>
                    <h2
                      className={`text-xl font-semibold mb-3 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      What's Included
                    </h2>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <FiCheck className="text-green-500 mt-1" />
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Professional service by experienced provider
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FiCheck className="text-green-500 mt-1" />
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          All necessary tools and equipment included
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FiCheck className="text-green-500 mt-1" />
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Satisfaction guaranteed or money back
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FiCheck className="text-green-500 mt-1" />
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Flexible scheduling available
                        </span>
                      </li>
                    </ul>
                  </div>

                
                  {service.reviews && service.reviews.length > 0 && (
                    <div>
                      <h2
                        className={`text-xl font-semibold mb-4 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Customer Reviews
                      </h2>
                      <div className="space-y-4">
                        {service.reviews.map((review, index) => (
                          <div
                            key={index}
                            className={`border-b pb-4 ${
                              theme === "dark"
                                ? "border-slate-700"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p
                                  className={`font-medium ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {review.userName}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FiStar
                                      key={i}
                                      className={`text-sm ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : theme === "dark"
                                            ? "text-gray-600"
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
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }
                            >
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                
                <div className="md:col-span-1">
                  <div className="sticky top-4 space-y-6">
                    
                    <div
                      className={`rounded-lg p-6 ${
                        theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="text-center mb-6">
                        <p
                          className={`text-sm mb-2 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Service Price
                        </p>
                        <p className="text-4xl font-bold text-blue-600">
                          ${service.price}
                        </p>
                        <p
                          className={`text-sm mt-1 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          per service
                        </p>
                      </div>

                      <button
                        onClick={handleBookNow}
                        disabled={user?.email === service.providerEmail}
                        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                          user?.email === service.providerEmail
                            ? theme === "dark"
                              ? "bg-slate-600 text-gray-400 cursor-not-allowed"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {user?.email === service.providerEmail
                          ? "Can't Book Own Service"
                          : "Book Now"}
                      </button>

                      {!user && (
                        <p
                          className={`text-center text-sm mt-3 ${
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Please login to book this service
                        </p>
                      )}
                    </div>

                    
                    <div
                      className={`rounded-lg p-6 ${
                        theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-4 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Service Provider
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiUser
                            className={
                              theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }
                          />
                          <span
                            className={
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            {service.providerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiMail
                            className={
                              theme === "dark"
                                ? "text-gray-500"
                                : "text-gray-400"
                            }
                          />
                          <span
                            className={`text-sm break-all ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {service.providerEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-lg p-6 max-w-md w-full ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Book Service
            </h3>

            <div className="space-y-4">
              
              <div
                className={`rounded-lg p-4 ${
                  theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`font-semibold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {service.serviceName}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Provider: {service.providerName}
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  Price: ${service.price}
                </p>
              </div>

              
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Your Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className={`w-full px-4 py-2 border rounded-lg cursor-not-allowed ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select Booking Date *
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

             
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                    theme === "dark"
                      ? "border border-slate-600 text-gray-400 hover:bg-slate-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;
