import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft } from "react-icons/fi";

const ErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | HomeHero</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-dark-bg dark:to-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <span className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              404
            </span>
          </motion.div>

          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <div className="text-6xl">🏠❓</div>
          </motion.div>

          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            The page you're looking for seems to have moved, been deleted, or
            doesn't exist. Let's get you back on track!
          </p>

          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:scale-105"
            >
              <FiHome />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FiArrowLeft />
              Go Back
            </button>
          </div>

          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Here are some helpful links:
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/services"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Browse Services
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Login
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                to="/register"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ErrorPage;
