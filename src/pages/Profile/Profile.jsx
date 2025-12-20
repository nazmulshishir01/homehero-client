import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCamera,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthProvider";
import { useTheme } from "../../contexts/ThemeProvider";
import toast from "react-hot-toast";

const Profile = () => {
  const { theme } = useTheme();
  const { user, updateUserProfile, lastLoginTime } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(formData.displayName, formData.photoURL);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(false);
  };

  return (
    <>
      <Helmet>
        <title>Profile - HomeHero</title>
        <meta name="description" content="Manage your HomeHero profile" />
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
            className="max-w-4xl mx-auto"
          >
         
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-2xl p-8 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-xl">
                      <FiUser className="text-5xl text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 p-2 bg-white text-primary-500 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <FiCamera className="text-xl" />
                  </button>
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.displayName || "User"}
                  </h1>
                  <p className="text-white/90 mb-1">{user?.email}</p>
                  <p className="text-sm text-white/70">
                    Member since{" "}
                    {new Date(
                      user?.metadata?.creationTime || Date.now(),
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

          
            <div
              className={`rounded-b-2xl shadow-xl p-8 ${
                theme === "dark" ? "bg-slate-800" : "bg-white"
              }`}
            >
              {!isEditing ? (
                <>
                 
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                    >
                      <FiEdit2 />
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      className={`rounded-lg p-4 ${
                        theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FiUser className="text-primary-500" />
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Full Name
                        </span>
                      </div>
                      <p
                        className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user?.displayName || "Not set"}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg p-4 ${
                        theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FiMail className="text-primary-500" />
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Email Address
                        </span>
                      </div>
                      <p
                        className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user?.email}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg p-4 ${
                        theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FiCalendar className="text-primary-500" />
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Last Login
                        </span>
                      </div>
                      <p
                        className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {lastLoginTime
                          ? new Date(lastLoginTime).toLocaleString()
                          : "Just now"}
                      </p>
                    </div>

                    <div
                      className={`rounded-lg p-4 ${
                        theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FiUser className="text-primary-500" />
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Account Status
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        Active
                      </p>
                    </div>
                  </div>

             
                  <div className="mt-8">
                    <h3
                      className={`text-xl font-bold mb-4 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Account Details
                    </h3>
                    <div
                      className={`rounded-lg p-6 ${
                        theme === "dark" ? "bg-slate-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p
                            className={`text-sm mb-1 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            User ID
                          </p>
                          <p
                            className={`font-mono text-sm ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user?.uid}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm mb-1 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Provider
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user?.providerData?.[0]?.providerId ===
                            "google.com"
                              ? "Google"
                              : "Email/Password"}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm mb-1 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Email Verified
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {user?.emailVerified ? "Yes ✓" : "No ✗"}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm mb-1 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Account Created
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {new Date(
                              user?.metadata?.creationTime || Date.now(),
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                 
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Edit Profile
                    </h2>
                    <button
                      onClick={handleCancel}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "hover:bg-slate-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <FiX className="text-xl" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              displayName: e.target.value,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                            theme === "dark"
                              ? "bg-slate-700 border-slate-600"
                              : "bg-gray-50 border-gray-200"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Photo URL
                      </label>
                      <div className="relative">
                        <FiCamera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          value={formData.photoURL}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              photoURL: e.target.value,
                            })
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
                            theme === "dark"
                              ? "bg-slate-700 border-slate-600"
                              : "bg-gray-50 border-gray-200"
                          }`}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      <p
                        className={`mt-1 text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Enter a direct link to your profile photo
                      </p>
                    </div>

                    
                    {formData.photoURL && (
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Photo Preview
                        </label>
                        <img
                          src={formData.photoURL}
                          alt="Preview"
                          className={`w-32 h-32 rounded-full object-cover border-4 ${
                            theme === "dark"
                              ? "border-slate-600"
                              : "border-gray-200"
                          }`}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=Invalid+URL";
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email Address (Cannot be changed)
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={user?.email}
                          readOnly
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg cursor-not-allowed ${
                            theme === "dark"
                              ? "bg-slate-700 border-slate-600"
                              : "bg-gray-100 border-gray-200"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                          theme === "dark"
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;
