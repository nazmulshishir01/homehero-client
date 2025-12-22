import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiEdit3, FiTrash2, FiPlus, FiEye, FiDollarSign } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthProvider";
import { useTheme } from "../../contexts/ThemeProvider";

import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const MyServices = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyServices();
  }, [user]);

  const fetchMyServices = async () => {
    if (!user?.email) return;

    try {
      const token = localStorage.getItem("access-token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-services?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setServices(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch your services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId, serviceName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${serviceName}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("access-token");
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/services/${serviceId}?email=${
            user.email
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        
        setServices(services.filter((service) => service._id !== serviceId));

        Swal.fire("Deleted!", "Your service has been deleted.", "success");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete service");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>My Services - HomeHero</title>
        <meta name="description" content="Manage your services on HomeHero" />
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
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h1
                  className={`text-3xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  My Services
                </h1>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage and track your listed services
                </p>
              </div>
              <Link
                to="/add-service"
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                <FiPlus />
                Add New Service
              </Link>
            </div>

            {services.length === 0 ? (
              <div
                className={`rounded-2xl shadow-xl p-12 text-center ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div className="text-6xl mb-4">📦</div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  No Services Yet
                </h2>
                <p
                  className={`mb-6 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Start by adding your first service to connect with customers
                </p>
                <Link
                  to="/add-service"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  <FiPlus />
                  Add Your First Service
                </Link>
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
                          Total Services
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {services.length}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          theme === "dark"
                            ? "bg-primary-900/30"
                            : "bg-primary-100"
                        }`}
                      >
                        <FiPlus className="text-2xl text-primary-500" />
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
                          Average Price
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          $
                          {(
                            services.reduce((acc, s) => acc + s.price, 0) /
                            services.length
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          theme === "dark" ? "bg-green-900/30" : "bg-green-100"
                        }`}
                      >
                        <FiDollarSign className="text-2xl text-green-500" />
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
                          Total Reviews
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {services.reduce(
                            (acc, s) => acc + (s.reviews?.length || 0),
                            0,
                          )}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          theme === "dark"
                            ? "bg-yellow-900/30"
                            : "bg-yellow-100"
                        }`}
                      >
                        <span className="text-2xl">⭐</span>
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
                            Category
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
                            Rating
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
                        {services.map((service) => (
                          <motion.tr
                            key={service._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`transition-colors ${
                              theme === "dark"
                                ? "hover:bg-slate-700"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={
                                    service.imageUrl ||
                                    "https://via.placeholder.com/50"
                                  }
                                  alt={service.serviceName}
                                  className="w-12 h-12 rounded-lg object-cover mr-4"
                                />
                                <div>
                                  <div
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {service.serviceName}
                                  </div>
                                  <div
                                    className={`text-sm truncate max-w-xs ${
                                      theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {service.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                  theme === "dark"
                                    ? "bg-primary-900/30 text-primary-300"
                                    : "bg-primary-100 text-primary-700"
                                }`}
                              >
                                {service.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className={`text-sm font-semibold ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                ${service.price}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="text-yellow-400 mr-1">⭐</span>
                                <span
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {service.averageRating?.toFixed(1) || "0.0"}
                                  <span className="text-xs ml-1">
                                    ({service.reviews?.length || 0})
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  to={`/services/${service._id}`}
                                  className={`p-2 rounded-lg transition-colors ${
                                    theme === "dark"
                                      ? "text-blue-400 hover:bg-blue-900/20"
                                      : "text-blue-600 hover:bg-blue-50"
                                  }`}
                                  title="View"
                                >
                                  <FiEye />
                                </Link>
                                <Link
                                  to={`/update-service/${service._id}`}
                                  className={`p-2 rounded-lg transition-colors ${
                                    theme === "dark"
                                      ? "text-green-400 hover:bg-green-900/20"
                                      : "text-green-600 hover:bg-green-50"
                                  }`}
                                  title="Edit"
                                >
                                  <FiEdit3 />
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      service._id,
                                      service.serviceName,
                                    )
                                  }
                                  className={`p-2 rounded-lg transition-colors ${
                                    theme === "dark"
                                      ? "text-red-400 hover:bg-red-900/20"
                                      : "text-red-600 hover:bg-red-50"
                                  }`}
                                  title="Delete"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl shadow-lg overflow-hidden ${
                        theme === "dark" ? "bg-slate-800" : "bg-white"
                      }`}
                    >
                      <img
                        src={
                          service.imageUrl ||
                          "https://via.placeholder.com/400x200"
                        }
                        alt={service.serviceName}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3
                            className={`font-semibold ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {service.serviceName}
                          </h3>
                          <span className="text-lg font-bold text-primary-500">
                            ${service.price}
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-3 line-clamp-2 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              theme === "dark"
                                ? "bg-primary-900/30 text-primary-300"
                                : "bg-primary-100 text-primary-700"
                            }`}
                          >
                            {service.category}
                          </span>
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1 text-sm">
                              ⭐
                            </span>
                            <span
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {service.averageRating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/services/${service._id}`}
                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-center text-sm font-semibold hover:bg-blue-600 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            to={`/update-service/${service._id}`}
                            className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg text-center text-sm font-semibold hover:bg-green-600 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(service._id, service.serviceName)
                            }
                            className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MyServices;
