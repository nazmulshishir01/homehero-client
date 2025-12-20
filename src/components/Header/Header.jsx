import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiHome,
  FiTool,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import toast from "react-hot-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const navLinks = [
    { path: "/", label: "Home", icon: <FiHome /> },
    { path: "/services", label: "Services", icon: <FiTool /> },
  ];

  const privateLinks = [
    { path: "/my-services", label: "My Services" },
    { path: "/add-service", label: "Add Service" },
    { path: "/my-bookings", label: "My Bookings" },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
        : theme === "dark"
          ? "text-gray-300 hover:bg-slate-700"
          : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? theme === "dark"
            ? "bg-slate-900/90 backdrop-blur-lg shadow-lg"
            : "bg-white/90 backdrop-blur-lg shadow-lg"
          : theme === "dark"
            ? "bg-slate-900"
            : "bg-white"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={navLinkClass}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}

              {user &&
                privateLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={navLinkClass}
                  >
                    <span>{link.label}</span>
                  </NavLink>
                ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "bg-slate-700 hover:bg-slate-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <FiMoon className="text-xl" />
                ) : (
                  <FiSun className="text-xl" />
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "hover:bg-slate-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </div>
                    )}
                    <div className="hidden sm:block">
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {user.displayName || "User"}
                      </p>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    aria-label="Logout"
                  >
                    <FiLogOut className="text-xl" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "border-primary-500 text-primary-400 hover:bg-primary-900/20"
                        : "border-primary-500 text-primary-500 hover:bg-primary-50"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-slate-700 text-yellow-400"
                  : "bg-gray-100"
              }`}
            >
              {theme === "light" ? (
                <FiMoon />
              ) : (
                <FiSun className="text-yellow-400" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg ${
                theme === "dark" ? "bg-slate-700" : "bg-gray-100"
              }`}
            >
              {isMenuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden mt-4 overflow-hidden ${
                theme === "dark"
                  ? "border-t border-slate-700"
                  : "border-t border-gray-200"
              }`}
            >
              <div className="flex flex-col gap-2 py-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                ))}

                {user &&
                  privateLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={navLinkClass}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                    </NavLink>
                  ))}

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        theme === "dark"
                          ? "hover:bg-slate-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div
                    className={`flex gap-2 pt-2 border-t ${
                      theme === "dark" ? "border-slate-700" : "border-gray-200"
                    }`}
                  >
                    <Link
                      to="/login"
                      className={`flex-1 px-4 py-2 text-center rounded-lg border transition-colors ${
                        theme === "dark"
                          ? "border-primary-500 text-primary-400 hover:bg-primary-900/20"
                          : "border-primary-500 text-primary-500"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 px-4 py-2 text-center rounded-lg bg-primary-500 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
