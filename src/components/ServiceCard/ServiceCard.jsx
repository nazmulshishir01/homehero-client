import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";

const ServiceCard = ({ service }) => {
  const {
    _id,
    serviceName,
    category,
    price,
    description,
    imageUrl,
    providerName,
    providerEmail,
    averageRating = 4.5,
    reviews = [],
  } = service;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl || "https://via.placeholder.com/400x300"}
          alt={serviceName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

       
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-semibold text-primary-600 dark:text-primary-400 rounded-full">
          {category}
        </span>

      
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-1 text-gray-900 dark:text-white font-bold">
            <FiDollarSign className="text-green-500" />
            {price}
          </div>
        </div>
      </div>

      
      <div className="p-6">
       
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
            {serviceName}
          </h3>
          <div className="flex items-center gap-1">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {averageRating.toFixed(1)}
            </span>
            {reviews.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({reviews.length})
              </span>
            )}
          </div>
        </div>

        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>

        
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <FiUser className="text-primary-500" />
          <span>by {providerName}</span>
        </div>

        
        <Link
          to={`/services/${_id}`}
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:scale-105"
        >
          View Details
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
