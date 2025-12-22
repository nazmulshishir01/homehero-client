import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiImage,
  FiTag,
  FiFileText,
  FiUser,
  FiMail,
  FiArrowLeft,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const UpdateService = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    providerName: user?.displayName || "",
    providerEmail: user?.email || "",
  });

  const categories = [
    "House Cleaning",
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Gardening",
    "Painting",
    "Carpentry",
    "HVAC",
    "Pest Control",
    "Moving Services",
    "Appliance Repair",
    "Roofing",
    "Flooring",
    "Window Cleaning",
  ];

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const service = response.data;

      
      if (service.providerEmail !== user?.email) {
        toast.error("You can only edit your own services");
        navigate("/my-services");
        return;
      }

      setFormData({
        serviceName: service.serviceName || "",
        category: service.category || "",
        price: service.price || "",
        description: service.description || "",
        imageUrl: service.imageUrl || "",
        providerName: service.providerName || user?.displayName || "",
        providerEmail: service.providerEmail || user?.email || "",
      });
    } catch (error) {
      console.error("Error fetching service:", error);
      toast.error("Failed to load service details");
      navigate("/my-services");
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (
      !formData.serviceName ||
      !formData.category ||
      !formData.price ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access-token");

      
      const serviceData = {
        serviceName: formData.serviceName,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        imageUrl: formData.imageUrl || "https://via.placeholder.com/400x300",
        providerName: user?.displayName || "Service Provider",
        providerEmail: user?.email,
      };

     const response = await axios.patch(
  `${import.meta.env.VITE_API_URL}/services/${id}?email=${user?.email}`,
        serviceData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Service updated successfully!");
      navigate("/my-services");
    } catch (error) {
      console.error("Error updating service:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update service. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Update Service - HomeHero</title>
        <meta name="description" content="Update your service on HomeHero" />
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
            className="max-w-3xl mx-auto"
          >
            
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/my-services")}
                className={`p-2 rounded-lg transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FiArrowLeft className="text-xl" />
              </button>
              <div className="text-left">
                <h1
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Update Service
                </h1>
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Edit your service details
                </p>
              </div>
            </div>

            
            <div
              className={`rounded-2xl shadow-xl p-8 ${
                theme === "dark" ? "bg-slate-800" : "bg-white"
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
              
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        theme === "dark"
                          ? "bg-slate-700 border-slate-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="e.g., Professional House Cleaning"
                      required
                    />
                  </div>
                </div>

                
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

               
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        theme === "dark"
                          ? "bg-slate-700 border-slate-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="99.99"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

          
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-4 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                        theme === "dark"
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                      placeholder="Describe your service in detail..."
                      required
                    />
                  </div>
                </div>

               
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Service Image URL{" "}
                    <span
                      className={
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }
                    >
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        theme === "dark"
                          ? "bg-slate-700 border-slate-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                      placeholder="https://example.com/service-image.jpg"
                    />
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Use a direct image URL from services like Unsplash, Pexels,
                    or your image hosting
                  </p>
                </div>

                
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Provider Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={user?.displayName || "Provider Name"}
                      readOnly
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg cursor-not-allowed ${
                        theme === "dark"
                          ? "bg-slate-700 border-slate-600 text-gray-400"
                          : "bg-gray-100 border-gray-200 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Provider Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg cursor-not-allowed ${
                        theme === "dark"
                          ? "bg-slate-700 border-slate-600 text-gray-400"
                          : "bg-gray-100 border-gray-200 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

           
                {formData.imageUrl && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Image Preview
                    </label>
                    <img
                      src={formData.imageUrl}
                      alt="Service preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !user}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating Service...
                    </span>
                  ) : (
                    "Update Service"
                  )}
                </button>

                {!user && (
                  <p className="text-center text-red-500 text-sm">
                    Please login to update a service
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UpdateService;
