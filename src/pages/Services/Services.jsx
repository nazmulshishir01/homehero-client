import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiDollarSign, FiStar } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeProvider";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Services = () => {
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/services`,
      );
      console.log("Fetched services:", response.data);
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      const dummyServices = [
        {
          _id: "1",
          serviceName: "House Cleaning",
          category: "Cleaning",
          price: 50,
          description: "Professional house cleaning service",
          imageUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          providerName: "John Doe",
          averageRating: 4.5,
        },
        {
          _id: "2",
          serviceName: "Plumbing Service",
          category: "Plumbing",
          price: 80,
          description: "Expert plumbing solutions",
          imageUrl:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
          providerName: "Mike Smith",
          averageRating: 4.8,
        },
      ];
      setServices(dummyServices);
      setFilteredServices(dummyServices);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`,
      );
      setCategories(["all", ...response.data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        "all",
        "Cleaning",
        "Plumbing",
        "Electrical",
        "Gardening",
        "Painting",
        "Carpentry",
        "HVAC",
      ]);
    }
  };

  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.serviceName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory,
      );
    }

    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((service) => {
        const price = service.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, priceRange, services]);

  const handlePriceFilter = () => {
    setPriceRange({ ...priceRange });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>All Services - HomeHero</title>
        <meta
          name="description"
          content="Browse all available services on HomeHero"
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
            className="text-center mb-12"
          >
            <h1
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              All Services
            </h1>
            <p
              className={`text-xl ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Find the perfect service provider for your needs
            </p>
          </motion.div>

      
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl shadow-lg p-6 mb-8 ${
              theme === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="md:col-span-1">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Search Services
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                      theme === "dark"
                        ? "bg-slate-700 border border-slate-600 text-white"
                        : "bg-gray-50 border border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              
              <div className="md:col-span-1">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                    theme === "dark"
                      ? "bg-slate-700 border border-slate-600 text-white"
                      : "bg-gray-50 border border-gray-300 text-gray-900"
                  }`}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

           
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Price Range
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      placeholder="Min"
                      className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        theme === "dark"
                          ? "bg-slate-700 border border-slate-600 text-white"
                          : "bg-gray-50 border border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <span
                    className={
                      theme === "dark" ? "text-gray-500" : "text-gray-500"
                    }
                  >
                    -
                  </span>
                  <div className="relative flex-1">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      placeholder="Max"
                      className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                        theme === "dark"
                          ? "bg-slate-700 border border-slate-600 text-white"
                          : "bg-gray-50 border border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                  <button
                    onClick={handlePriceFilter}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <FiFilter />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          
          <div className="mb-6">
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Showing {filteredServices.length}{" "}
              {filteredServices.length === 1 ? "service" : "services"}
            </p>
          </div>

          
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        service.imageUrl ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={service.serviceName}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          theme === "dark"
                            ? "bg-primary-900/30 text-primary-400"
                            : "bg-primary-100 text-primary-600"
                        }`}
                      >
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-400 fill-current" />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {service.averageRating?.toFixed(1) || "4.5"}
                        </span>
                      </div>
                    </div>
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {service.serviceName}
                    </h3>
                    <p
                      className={`mb-4 line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          ${service.price}
                        </p>
                        <p
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          per service
                        </p>
                      </div>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        by {service.providerName}
                      </p>
                    </div>
                    <Link
                      to={`/services/${service._id}`}
                      className="w-full inline-block text-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                No Services Found
              </h3>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange({ min: "", max: "" });
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
