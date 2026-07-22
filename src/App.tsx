import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import { Navbar } from "./components/common/Navbar";
import Loading from "./components/common/Loading";
import "./styles/global.css";
import { useUserData } from "./context/UserContext";

// Route components are code-split so the initial bundle stays small;
// each page's JS is fetched on demand when its route is first visited.
const Login = lazy(() => import("./pages/auth/Login"));
const Home = lazy(() => import("./pages/Home/Home"));
const Register = lazy(() => import("./pages/auth/Register"));
const PropertyForm = lazy(() => import("./pages/property/PropertyForm"));
const PropertyImage = lazy(() => import("./pages/property/PropertyImage"));
const PropertyView = lazy(() => import("./pages/property/PropertyView"));
const PropertyReview = lazy(() => import("./pages/property/PropertyReview"));
const ManageProperty = lazy(() => import("./pages/property/ManageProperty"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const Bookings = lazy(() => import("./pages/bookings/Bookings"));
const Messages = lazy(() => import("./pages/messages/Messages"));
const MyBookings = lazy(() => import("./pages/bookings/MyBookings"));
const Profile = lazy(() => import("./pages/Profile"));
const OwnerHome = lazy(() => import("./pages/Home/OwnerHome"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Guests = lazy(() => import("./pages/Guests"));

const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};

function AppRoutes() {
  const { userData } = useUserData();
  const location = useLocation();

  const isOwner = userData.role === "OWNER";
  const isRenter = userData.role === "RENTER";

  return (
    <div key={location.pathname} className="page-enter">
      <Suspense fallback={<Loading />}>
      <Routes location={location}>
          {/* Home Page */}
          <Route path="/" element={isOwner ? <OwnerHome /> : <Home />} />

          {/* Auth Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Owner Routes */}
          <Route element={<ProtectedRoutes />}>
            {isOwner && (
              <>
                <Route path="/property/form" element={<PropertyForm />} />
                <Route path="/property/image" element={<PropertyImage />} />
                <Route path="/property/review" element={<PropertyReview />} />
                <Route path="/manage" element={<ManageProperty />} />
                <Route
                  path="/property/edit/info/:id"
                  element={<PropertyForm />}
                />
                <Route
                  path="/property/edit/image/:id"
                  element={<PropertyImage />}
                />
                <Route
                  path="/property/edit/review/:id"
                  element={<PropertyReview />}
                />

                <Route path="/bookings" element={<Bookings />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/guests" element={<Guests />} />
              </>
            )}

            {/* Renter Routes */}
            {isRenter && (
              <>
                <Route path="/my-bookings" element={<MyBookings />} />
              </>
            )}
            <Route path="/property/:id" element={<PropertyView />} />

            {/* Messages Routes */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Messages />} />

            <Route path="/profile" element={<Profile />} />

            {/* Page not found */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-dark-800">
        <Navbar />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
