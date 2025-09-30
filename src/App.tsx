// src/App.tsx

import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/SignUp";
import FormatPaper from "./pages/FormatPaper";
import AdminUsersHistory from "./pages/AdminUsersHistory";
import SeeSample from "./pages/SeeSample";
// import LoginAdmin from "./pages/LoginAdmin";
import AdminSignUp from "./pages/AdminSignUp";
import AdminProtectedRoute from "./component/AdminProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/createadmin" element={<AdminSignUp />} />
      <Route path="/samples" element={<SeeSample />} />
      {/* <Route path="/admin" element={<LoginAdmin />} /> */}
      <Route
        path="/format"
        element={
            <FormatPaper />
        }
      />
      {/* Admin route - protected for admin users only */}
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminUsersHistory />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;