// src/App.tsx

import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
// import LoginPage from "./pages/Loging";
// import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./component/ProtectedRoute"; // optional

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      <Route
        path="/dashboard"
        element={   
            <Dashboard />
        }
      />
    </Routes>
  );
}

export default App;
