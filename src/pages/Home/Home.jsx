import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import {
  FiArrowRight,
  FiCheck,
  FiUsers,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiStar,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { useTheme } from "../../contexts/ThemeProvider";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const Home = () => {
  const { theme } = useTheme();
  const [pageLoading, setPageLoading] = useState(true); 
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const pageLoadTimer = setTimeout(() => {
      setPageLoading(false);
    }, 200);

    return () => clearTimeout(pageLoadTimer);
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/services?limit=6`,
      );
      console.log("Fetched services:", response.data);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([
        {
          _id: "1",
          serviceName: "House Cleaning",
          category: "Cleaning",
          price: 50,
          description: "Professional house cleaning service with trained staff",
          imageUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          providerName: "John Doe",
        },
        {
          _id: "2",
          serviceName: "Plumbing Service",
          category: "Plumbing",
          price: 80,
          description: "Expert plumbing solutions for all your needs",
          imageUrl:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
          providerName: "Mike Smith",
        },
        {
          _id: "3",
          serviceName: "Electrical Repair",
          category: "Electrical",
          price: 100,
          description: "Safe and reliable electrical repair services",
          imageUrl:
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
          providerName: "David Wilson",
        },
        {
          _id: "4",
          serviceName: "Gardening",
          category: "Gardening",
          price: 60,
          description: "Beautiful garden maintenance and landscaping",
          imageUrl:
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
          providerName: "Sarah Green",
        },
        {
          _id: "5",
          serviceName: "Painting Service",
          category: "Painting",
          price: 150,
          description: "Professional painting for homes and offices",
          imageUrl:
            "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400",
          providerName: "Tom Brown",
        },
        {
          _id: "6",
          serviceName: "AC Repair",
          category: "HVAC",
          price: 120,
          description: "Quick AC repair and maintenance service",
          imageUrl:
            "https://images.unsplash.com/photo-1631545806609-90e678c12e05?w=400",
          providerName: "James Lee",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const heroSlides = [
    {
      id: 1,
      title: "Professional Home Services",
      subtitle: "Trusted Local Experts",
      description:
        "Connect with verified professionals for all your home maintenance needs",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1920",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      id: 2,
      title: "Quick & Reliable",
      subtitle: "Same Day Service",
      description:
        "Get instant quotes and book services with just a few clicks",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1920",
      gradient: "from-green-600 to-teal-600",
    },
    {
      id: 3,
      title: "Quality Guaranteed",
      subtitle: "100% Satisfaction",
      description: "All services backed by our quality guarantee and insurance",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920",
      gradient: "from-orange-600 to-red-600",
    },
  ];

  const features = [
    {
      icon: <FiShield className="text-3xl" />,
      title: "Verified Professionals",
      description:
        "All service providers are thoroughly vetted and background checked",
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "Quick Booking",
      description: "Book services instantly with real-time availability",
    },
    {
      icon: <FiUsers className="text-3xl" />,
      title: "Customer Reviews",
      description: "Read genuine reviews from verified customers",
    },
    {
      icon: <FiTrendingUp className="text-3xl" />,
      title: "Competitive Pricing",
      description: "Compare prices and choose the best value for your needs",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Service Providers" },
    { value: "50+", label: "Service Categories" },
    { value: "4.8", label: "Average Rating" },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      comment:
        "HomeHero made finding a reliable plumber so easy! The service was professional and the pricing was transparent.",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Owner",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 5,
      comment:
        "I use HomeHero for all my office maintenance needs. The quality of service providers is consistently excellent.",
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Property Manager",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      rating: 5,
      comment:
        "Managing multiple properties is easier with HomeHero. Quick response times and reliable professionals every time.",
    },
  ];

  // ✅ Show LoadingSpinner when page is loading
  if (pageLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>HomeHero - Your Local Service Expert</title>
        <meta
          name="description"
          content="Connect with trusted local service providers for all your home needs"
        />
      </Helmet>

      {/* Hero Section with Slider */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="h-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-70`}
                  ></div>
                </div>
                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="max-w-3xl text-white"
                    >
                      <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl mb-8 text-white/90">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to="/services"
                          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                        >
                          Explore Services
                          <FiArrowRight />
                        </Link>
                        <Link
                          to="/register"
                          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
                        >
                          Become a Provider
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Dynamic Section - 6 Services from Database */}
      <section
        className={`py-20 ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                theme === "dark"
                  ? "bg-primary-900/30 text-primary-400"
                  : "bg-primary-100 text-primary-600"
              }`}
            >
              <HiSparkles />
              Our Services
            </span>
            <h2
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Popular Services
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Discover our most booked services with excellent customer ratings
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
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
                      <div className="text-2xl font-bold text-primary-600">
                        ${service.price}
                      </div>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        by {service.providerName}
                      </p>
                    </div>
                    <Link
                      to={`/services/${service._id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                    >
                      View Details
                      <FiArrowRight />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p
                className={`text-xl mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No services available at the moment
              </p>
              <Link
                to="/add-service"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Add First Service
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-primary-500/30 transition-all transform hover:scale-105"
            >
              View All Services
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className={`py-20 ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Why Choose HomeHero
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We're committed to providing the best service experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    theme === "dark"
                      ? "bg-primary-900/30 text-primary-400"
                      : "bg-primary-100 text-primary-600"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className={`py-20 ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              What Our Customers Say
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Don't just take our word for it, hear from our satisfied customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl shadow-xl ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4
                      className={`font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <p
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
