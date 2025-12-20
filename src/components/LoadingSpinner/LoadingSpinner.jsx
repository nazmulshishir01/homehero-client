import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeProvider";

const LoadingSpinner = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-slate-900" : "bg-gray-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div
            className={`w-20 h-20 border-4 rounded-full ${
              theme === "dark" ? "border-primary-900/30" : "border-primary-200"
            }`}
          ></div>
          <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p
          className={`mt-4 font-semibold ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Loading...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
