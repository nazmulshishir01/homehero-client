import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiMail,
  FiTrash2,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const MyBookings = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (user?.email) {
      fetchMyBookings();
    }
  }, [user]);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Fetched bookings:", response.data);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, serviceName) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: `Are you sure you want to cancel booking for "${serviceName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access-token");
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/bookings/${bookingId}?email=${
            user.email
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setBookings(bookings.filter((booking) => booking._id !== bookingId));

        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("Failed to cancel booking");
      }
    }
  };

  const handleAddReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
    setReviewData({ rating: 5, comment: "" });
  };

  const submitReview = async () => {
    if (!reviewData.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      const token = localStorage.getItem("access-token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/services/${
          selectedBooking.serviceId
        }/review`,
        {
          rating: reviewData.rating,
          comment: reviewData.comment,
          userName: user.displayName || "Anonymous",
          userEmail: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Review added successfully!");
      setShowReviewModal(false);

      setBookings(
        bookings.map((booking) =>
          booking._id === selectedBooking._id
            ? { ...booking, hasReviewed: true }
            : booking,
        ),
      );
    } catch (error) {
      console.error("Error adding review:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add review");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>My Bookings - HomeHero</title>
        <meta
          name="description"
          content="View and manage your service bookings"
        />
      </Helmet>

      <div
        className={`min-h-screen py-12 ${
          theme === "dark" ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                My Bookings
              </h1>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Manage your booked services and leave reviews
              </p>
            </div>

            {bookings.length === 0 ? (
              <div
                className={`rounded-2xl shadow-xl p-12 text-center ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div className="text-6xl mb-4">📅</div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  No Bookings Yet
                </h2>
                <p
                  className={`mb-6 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  You haven't booked any services yet. Explore our services to
                  get started!
                </p>
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  Browse Services
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div
                    className={`rounded-xl p-6 shadow-lg ${
                      theme === "dark" ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Total Bookings
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {bookings.length}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          theme === "dark"
                            ? "bg-primary-900/30"
                            : "bg-primary-100"
                        }`}
                      >
                        <FiCalendar className="text-2xl text-primary-500" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl p-6 shadow-lg ${
                      theme === "dark" ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Active Bookings
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {
                            bookings.filter((b) => b.status === "pending")
                              .length
                          }
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          theme === "dark" ? "bg-green-900/30" : "bg-green-100"
                        }`}
                      >
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-xl p-6 shadow-lg ${
                      theme === "dark" ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Total Spent
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ${bookings.reduce((acc, b) => acc + b.price, 0)}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          theme === "dark"
                            ? "bg-yellow-900/30"
                            : "bg-yellow-100"
                        }`}
                      >
                        <FiDollarSign className="text-2xl text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`hidden lg:block rounded-2xl shadow-xl overflow-hidden ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead
                        className={`border-b ${
                          theme === "dark"
                            ? "bg-slate-700 border-slate-600"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <tr>
                          <th
                            className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Service
                          </th>
                          <th
                            className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Provider
                          </th>
                          <th
                            className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Booking Date
                          </th>
                          <th
                            className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Price
                          </th>
                          <th
                            className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Status
                          </th>
                          <th
                            className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className={`divide-y ${
                          theme === "dark"
                            ? "divide-slate-700"
                            : "divide-gray-200"
                        }`}
                      >
                        {bookings.map((booking) => (
                          <motion.tr
                            key={booking._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`transition-colors ${
                              theme === "dark"
                                ? "hover:bg-slate-700"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div
                                  className={`text-sm font-medium ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {booking.serviceName ||
                                    booking.service?.serviceName}
                                </div>
                                <div
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  ID: {booking.serviceId}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {booking.providerName}
                                </div>
                                <div
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {booking.providerEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {new Date(
                                  booking.bookingDate,
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className={`text-sm font-semibold ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                ${booking.price}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  booking.status === "pending"
                                    ? theme === "dark"
                                      ? "bg-yellow-900/30 text-yellow-300"
                                      : "bg-yellow-100 text-yellow-700"
                                    : booking.status === "completed"
                                      ? theme === "dark"
                                        ? "bg-green-900/30 text-green-300"
                                        : "bg-green-100 text-green-700"
                                      : theme === "dark"
                                        ? "bg-red-900/30 text-red-300"
                                        : "bg-red-100 text-red-700"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {!booking.hasReviewed &&
                                  booking.status !== "cancelled" && (
                                    <button
                                      onClick={() => handleAddReview(booking)}
                                      className={`p-2 rounded-lg transition-colors ${
                                        theme === "dark"
                                          ? "text-blue-400 hover:bg-blue-900/20"
                                          : "text-blue-600 hover:bg-blue-50"
                                      }`}
                                      title="Add Review"
                                    >
                                      <FiStar />
                                    </button>
                                  )}
                                {booking.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(
                                        booking._id,
                                        booking.serviceName,
                                      )
                                    }
                                    className={`p-2 rounded-lg transition-colors ${
                                      theme === "dark"
                                        ? "text-red-400 hover:bg-red-900/20"
                                        : "text-red-600 hover:bg-red-50"
                                    }`}
                                    title="Cancel Booking"
                                  >
                                    <FiTrash2 />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map((booking) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl shadow-lg p-4 ${
                        theme === "dark" ? "bg-slate-800" : "bg-white"
                      }`}
                    >
                      <div className="mb-3">
                        <h3
                          className={`font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {booking.serviceName || booking.service?.serviceName}
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Provider: {booking.providerName}
                        </p>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Date:
                          </span>
                          <span
                            className={
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }
                          >
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Price:
                          </span>
                          <span
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ${booking.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          >
                            Status:
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === "pending"
                                ? theme === "dark"
                                  ? "bg-yellow-900/30 text-yellow-300"
                                  : "bg-yellow-100 text-yellow-700"
                                : booking.status === "completed"
                                  ? theme === "dark"
                                    ? "bg-green-900/30 text-green-300"
                                    : "bg-green-100 text-green-700"
                                  : theme === "dark"
                                    ? "bg-red-900/30 text-red-300"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!booking.hasReviewed &&
                          booking.status !== "cancelled" && (
                            <button
                              onClick={() => handleAddReview(booking)}
                              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                            >
                              Add Review
                            </button>
                          )}
                        {booking.status === "pending" && (
                          <button
                            onClick={() =>
                              handleCancelBooking(
                                booking._id,
                                booking.serviceName,
                              )
                            }
                            className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl p-6 max-w-md w-full ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Add Review
            </h3>

            <div className="space-y-4">
              <div
                className={`rounded-lg p-3 ${
                  theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                }`}
              >
                <p
                  className={`font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedBooking.serviceName}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Provider: {selectedBooking.providerName}
                </p>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setReviewData({ ...reviewData, rating: star })
                      }
                      className="text-2xl"
                    >
                      {star <= reviewData.rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    theme === "dark"
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Share your experience with this service..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-all ${
                    theme === "dark"
                      ? "border-slate-600 text-gray-300 hover:bg-slate-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MyBookings;
