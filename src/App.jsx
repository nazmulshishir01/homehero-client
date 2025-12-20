import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./contexts/AuthProvider";
import ThemeProvider from "./contexts/ThemeProvider";
import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/ServiceDetails/ServiceDetails";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import MyServices from "./pages/MyServices/MyServices";
import AddService from "./pages/AddService/AddService";
import UpdateService from "./pages/UpdateService/UpdateService";
import MyBookings from "./pages/MyBookings/MyBookings";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                
                <Route index element={<Home />} />
                <Route path="services" element={<Services />} />
                <Route path="services/:id" element={<ServiceDetails />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

               
                <Route element={<PrivateRoute />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="my-services" element={<MyServices />} />
                  <Route path="add-service" element={<AddService />} />
                  <Route
                    path="update-service/:id"
                    element={<UpdateService />}
                  />
                  <Route path="my-bookings" element={<MyBookings />} />
                </Route>

                
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
