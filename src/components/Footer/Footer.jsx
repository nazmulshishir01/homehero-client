import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeProvider";

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const services = [
    "House Cleaning",
    "Plumbing",
    "Electrical",
    "Gardening",
    "Painting",
    "Carpentry",
  ];

  const socialLinks = [
    {
      icon: <FiFacebook />,
      url: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      icon: <BsTwitterX />,
      url: "https://twitter.com",
      label: "X",
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: <FiInstagram />,
      url: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      icon: <FiLinkedin />,
      url: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
  ];

  return (
    <footer
      className={`${
        theme === "dark"
          ? "bg-slate-900 text-gray-100"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      }`}
    >
     
      <div
        className={`border-b ${
          theme === "dark" ? "border-slate-700" : "border-gray-700"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">
                Subscribe to our Newsletter
              </h3>
              <p
                className={theme === "dark" ? "text-gray-400" : "text-gray-400"}
              >
                Get latest updates on new services and offers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`px-12 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  theme === "dark"
                    ? "bg-slate-800 border border-slate-600"
                    : "bg-gray-800 border border-gray-700"
                }`}
              />
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary-500/30">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

     
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
          <div>
            {/* Logo */}
<Link to="/" className="flex items-center gap-2 group">
  <img 
    src="/logo.png" 
    alt="HomeHero Logo"
    className="w-10 h-10 object-contain"
  />
  <div>
    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
      HomeHero
    </h1>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      Your Local Service Expert
    </p>
  </div>
</Link>
            <p
              className={`mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
            >
              Connecting you with trusted local service providers for all your
              home needs. Quality service, guaranteed satisfaction.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                    theme === "dark"
                      ? "bg-slate-800 hover:bg-slate-700"
                      : "bg-gray-800 hover:bg-gray-700"
                  } ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`transition-colors flex items-center gap-2 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-primary-400"
                        : "text-gray-400 hover:text-primary-400"
                    }`}
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Popular Services
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></span>
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to="/services"
                    className={`transition-colors flex items-center gap-2 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-primary-400"
                        : "text-gray-400 hover:text-primary-400"
                    }`}
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        
          <div>
            <h3 className="text-xl font-bold mb-6 relative">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></span>
            </h3>
            <ul className="space-y-4">
              <li
                className={`flex items-start gap-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              >
                <FiMapPin className="text-primary-500 mt-1 flex-shrink-0" />
                <span>13 Service Street, Mirpur - 1206</span>
              </li>
              <li
                className={`flex items-center gap-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              >
                <FiPhone className="text-primary-500 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary-400 transition-colors"
                >
                  +88 01711-567890
                </a>
              </li>
              <li
                className={`flex items-center gap-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              >
                <FiMail className="text-primary-500 flex-shrink-0" />
                <a
                  href="mailto:info@homehero.com"
                  className="hover:text-primary-400 transition-colors"
                >
                  info@homehero.com
                </a>
              </li>
            </ul>

            
            <div
              className={`mt-6 p-4 rounded-lg ${
                theme === "dark" ? "bg-slate-800" : "bg-gray-800"
              }`}
            >
              <h4 className="font-semibold mb-2">Business Hours</h4>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              >
                Mon - Fri: 8:00 AM - 8:00 PM
              </p>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              >
                Sat - Sun: 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

   
      <div
        className={`border-t ${
          theme === "dark" ? "border-slate-700" : "border-gray-700"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className={
                theme === "dark"
                  ? "text-gray-400 text-center"
                  : "text-gray-400 text-center"
              }
            >
              © {currentYear} HomeHero. All rights reserved.
            </p>
            <div
              className={`flex items-center gap-6 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-400"
              }`}
            >
              <Link
                to="/privacy"
                className="hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-primary-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
