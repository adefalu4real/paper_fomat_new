import React, { useState, useEffect, FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, FileText } from "lucide-react"; // Using Lucide icons for simplicity


const REGISTER_API_URL = "http://localhost:5000/api/v1/user/createadmin";


export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disable, setDisable] = useState<boolean>(true); // Controls button disable state
  const [showPassword, setShowPassword] = useState<boolean>(false); // Controls password visibility
  const [isLoading, setIsLoading] = useState<boolean>(false); // Manages local loading state
  const navigate = useNavigate(); // Hook for programmatic navigation

 
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission to handle logic with React
    setIsLoading(true); // Indicate that a login attempt is in progress

     try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log(response)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account.");
      }

      const result = await response.json();
      console.log(result)
      localStorage.setItem("token", result.accessToken)
      
      console.log("User login successfully:", result);
      alert("Login successfully!");
      navigate("/format");

    } catch (error) {
      console.error("Registration error:", error);
      alert(`Registration failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  
  useEffect(() => {
    setDisable(!email || !password || !email.includes("@"));
  }, [email, password]); // Dependencies: runs whenever email or password states change

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-left"
      style={{ backgroundImage: "url('/Assets/login.jpg')" }} // Ensure this path is correct for your asset
    >
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center sm:p-12 md:w-auto md:min-w-[486px]">
        {/* Logo and navigation to home */}
        <div className="mb-8">
          <NavLink to={"/"} className="flex items-center gap-2">
            {/* Logo Icon (using a gradient background similar to landing page) */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" /> {/* Using FileText from Lucide */}
            </div>
            {/* Logo Text (using a color from the gradient palette) */}
            <span className="text-2xl font-bold text-indigo-600">FuTera</span>
          </NavLink>
        </div>

        {/* Welcome message */}
        <h4 className="text-gray-800 text-3xl font-semibold mb-2 text-center">
          Welcome Back
        </h4>
        <p className="text-gray-600 text-base font-normal text-center mb-8">
          Sign in with your email address and Password
        </p>

        {/* Login Form */}
        <form className="w-full" onSubmit={handleLogin}>
          {/* Email Input Field */}
          <div className="mb-6">
            <label htmlFor="email" className="text-gray-700 text-base mb-1 block">
              Email address
            </label>
            <div className="border border-gray-300 rounded-xl px-4 py-3">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="off"
                className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                onChange={(e) => setEmail(e.target.value)}
                value={email} // Controlled component
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="mb-6">
            <label htmlFor="password" className="text-gray-700 text-base mb-1 block">
              Password
            </label>
            <div className="border border-gray-300 rounded-xl px-4 py-2 flex items-center justify-between">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                autoComplete="off"
                className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                onChange={(e) => setPassword(e.target.value)}
                value={password} // Controlled component
              />
              <button
                type="button" // Prevents this button from submitting the form
                onClick={togglePasswordVisibility}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Section */}
          <div className="flex items-center justify-between mb-8 text-sm sm:text-base">
            <div className="flex items-center">
              {/* Custom styled checkbox */}
              <div className="relative mr-3 flex items-center">
                <input type="checkbox" id="rememberMe" className="opacity-0 absolute w-6 h-6 cursor-pointer z-10" />
                <label htmlFor="rememberMe" className="w-6 h-6 border-2 border-purple-500 rounded-full flex items-center justify-center absolute top-0 left-0 cursor-pointer">
                  <span className="w-3 h-3 border-b-2 border-r-2 border-purple-500 transform -rotate-45 opacity-0 checkbox-check"></span>
                </label>
                {/* Inline style for the custom checkbox checked state for preview environment */}
                <style>{`
                  input[type="checkbox"]:checked + label .checkbox-check {
                    opacity: 1;
                  }
                `}</style>
              </div>
              <p className="text-gray-500">Remember me</p>
            </div>
            <NavLink to="/forgotpassword" className="text-purple-600 font-semibold hover:underline">
              Forgot Password
            </NavLink>
          </div>

          {/* Submit Button with Loading Indicator */}
          <button
            type="submit" // This button submits the form
            disabled={disable || isLoading}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-700 text-white text-lg font-semibold transition-all duration-200 flex items-center justify-center ${
              disable || isLoading ? "opacity-50 cursor-not-allowed from-blue-300 to-purple-500" : "hover:from-blue-600 hover:to-purple-800 hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin w-5 h-5 text-white" />
            ) : (
              "Log in"
            )}
          </button>

          {/* Sign Up Link */}
          <div className="flex items-center justify-between mt-4 text-gray-600 gap-1 text-sm sm:text-base">
            <p>Don&apos;t have an account?</p>
            <NavLink to="/register" className="text-purple-600 font-bold underline ml-1 hover:text-purple-700">
              Sign Up
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
