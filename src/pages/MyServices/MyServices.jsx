import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEdit3, FiTrash2, FiPlus, FiEye, FiDollarSign, FiStar } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const MyServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyServices();
  }, [user]);

  const fetchMyServices = async () => {
    if (!user?.email) return;
    try {
      const token = localStorage.getItem('access-token');
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-services?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setServices(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch your services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId, serviceName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${serviceName}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access-token');
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/services/${serviceId}?email=${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Remove from state
        setServices(services.filter(service => service._id !== serviceId));
        
        Swal.fire(
          'Deleted!',
          'Your service has been deleted.',
          'success'
        );
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete service');
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
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  My Services
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Services Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
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
                {/* Services Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Services</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {services.length}
                        </p>
                      </div>
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <FiPlus className="text-2xl text-primary-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average Price</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${(services.reduce((acc, s) => acc + s.price, 0) / services.length).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <FiDollarSign className="text-2xl text-green-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {services.reduce((acc, s) => acc + (s.reviews?.length || 0), 0)}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <FiStar className="text-2xl text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Table - Desktop */}
                <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {services.map((service) => (
                          <motion.tr
                            key={service._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={service.imageUrl || 'https://via.placeholder.com/50'}
                                  alt={service.serviceName}
                                  className="w-12 h-12 rounded-lg object-cover mr-4"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {service.serviceName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                    {service.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                                {service.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                ${service.price}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <FiStar className="text-yellow-400 mr-1" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {(service.averageRating && service.averageRating > 0 ? service.averageRating : 4.5).toFixed(1)}
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
                                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="View"
                                >
                                  <FiEye />
                                </Link>
                                <Link
                                  to={`/update-service/${service._id}`}
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit3 />
                                </Link>
                                <button
                                  onClick={() => handleDelete(service._id, service.serviceName)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

                {/* Services Cards - Mobile */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                    >
                      <img
                        src={service.imageUrl || 'https://via.placeholder.com/400x200'}
                        alt={service.serviceName}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {service.serviceName}
                          </h3>
                          <span className="text-lg font-bold text-primary-500">
                            ${service.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                            {service.category}
                          </span>
                          <div className="flex items-center">
                            <FiStar className="text-yellow-400 mr-1 text-sm" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {(service.averageRating && service.averageRating > 0 ? service.averageRating : 4.5).toFixed(1)}
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
                            onClick={() => handleDelete(service._id, service.serviceName)}
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