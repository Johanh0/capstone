import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ContactPage from "./pages/Contact";
import Resource from "./pages/Resources";
import AdminAuth from "./pages/admin/AdminAuth";
import UserAuth from "./pages/userAuth";
import Profile from "./pages/Profile";
import Volunteer from "./pages/Volunteer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMain from "./pages/admin/AdminMain";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMessages from "./pages/admin/AdminMessages";
import About from "./pages/About";

// Import Header & Footer
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      {/* ✅ Header is outside of Routes so it appears on every page */}
      <Header />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resource />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<UserAuth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/about" element={<About />} />

          {/* Admin Routes */}
          <Route path="/admin_auth" element={<AdminAuth />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<AdminMain />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
