import React, { useState, useEffect, FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Corrected import syntax
import { Eye, EyeOff, LoaderCircle, FileText } from "lucide-react"; // Ensured FileText is imported

export  const REGISTER_API_URL = "http://localhost:5000/api/v1/user/create";


export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const navigate = useNavigate();


  // Basic client-side validation functions
  const validateEmail = (email: string) => email.includes("@") && email.length > 5;
  const validatePassword = (password: string) => password.length >= 6;
  const validateName = (name: string) => name.trim().length > 0;
  const validateUsername = (username: string) => username.trim().length > 0;
  const validatePhoneNum = (phone: string) => phone.length >= 7;

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateName(firstName)) { alert("First name is required."); setIsLoading(false); return; }
    if (!validateName(lastName)) { alert("Last name is required."); setIsLoading(false); return; }
    if (!validateEmail(email)) { alert("Please enter a valid email address."); setIsLoading(false); return; }
    if (!validatePassword(password)) { alert("Password must be at least 6 characters."); setIsLoading(false); return; }
    if (password !== confirmPassword) { alert("Passwords do not match."); setIsLoading(false); return; }
    if (!validateUsername(username)) { alert("Username is required."); setIsLoading(false); return; }
    if (!validatePhoneNum(phoneNum)) { alert("Phone number is required."); setIsLoading(false); return; }

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          username,
          phoneNum,
        }),
      });

      console.log(response)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account.");
      }

      const result = await response.json();
      console.log("Account created successfully:", result);
      alert("Account created successfully! You can now log in.");
      navigate("/login");

    } catch (error) {
      console.error("Registration error:", error);
      alert(`Registration failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    const valid =
      validateName(firstName) &&
      validateName(lastName) &&
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword &&
      validateUsername(username) &&
      validatePhoneNum(phoneNum);
    setIsFormValid(valid);
  }, [email, password, confirmPassword, firstName, lastName, username, phoneNum]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-left"
      style={{ backgroundImage: "url('/signupBg.jpg')" }} // Ensure this image path is correct
    >
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center sm:p-12 md:w-auto md:min-w-[800px]">
        {/* Logo and navigation to home */}
        <div className="mb-8">
          <NavLink to={"/"} className="flex items-center gap-2">
            {/* Logo Icon (using a gradient background similar to landing page) */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {/* Logo Text (using a color from the gradient palette) */}
            <span className="text-2xl font-bold text-indigo-600">FuTera</span>
          </NavLink>
        </div>

        {/* Title */}
        <h4 className="text-gray-800 text-2xl font-semibold mb-8 text-center">
          Create an account
        </h4>

        {/* Registration Form */}
        <form className="w-full" onSubmit={handleRegister}>
          {/* First Name and Last Name */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
            <div className="w-full sm:w-1/2">
              <label htmlFor="firstName" className="text-gray-700 text-base mb-1 block">
                Firstname
              </label>
              <div className="border border-gray-300 rounded-xl px-4 py-3">
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  required
                />
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="lastName" className="text-gray-700 text-base mb-1 block">
                Lastname
              </label>
              <div className="border border-gray-300 rounded-xl px-4 py-3">
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email and Password */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
            <div className="w-full sm:w-1/2">
              <label htmlFor="email" className="text-gray-700 text-base mb-1 block">
                Email address
              </label>
              <div className="border border-gray-300 rounded-xl px-4 py-3">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="password" className="text-gray-700 text-base mb-1 block">
                Password
              </label>
              <div className="border border-gray-300 rounded-xl px-4 py-2 flex items-center justify-between">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Username and Phone Number */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
            <div className="w-full sm:w-1/2">
              <label htmlFor="username" className="text-gray-700 text-base mb-1 block">
                Username
              </label>
              <div className="border border-gray-300 rounded-xl px-4 py-3">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="phoneNum" className="text-gray-700 text-base mb-1 block">
                Phone Number
              </label>
              <div className="border border-gray-300 rounded-xl px-4 py-3">
                <input
                  id="phoneNum"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                  onChange={(e) => setPhoneNum(e.target.value)}
                  value={phoneNum}
                  required
                />
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label htmlFor="confirmPassword" className="text-gray-700 text-base mb-1 block">
              Confirm Password
            </label>
            <div className="border border-gray-300 rounded-xl px-4 py-2 flex items-center justify-between">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className="w-full border-none outline-none text-base text-gray-700 placeholder-gray-400"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                aria-label="toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-700 text-white text-lg font-semibold transition-all duration-200 flex items-center justify-center ${
              isLoading || !isFormValid ? "opacity-50 cursor-not-allowed from-blue-300 to-purple-500" : "hover:from-blue-600 hover:to-purple-800 hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin w-5 h-5 text-white" />
            ) : (
              "Create Account"
            )}
          </button>

          {/* Already have an account link */}
          <div className="flex items-center justify-between mt-4 text-gray-600 gap-1 text-sm sm:text-base">
            <p>Already have an account?</p>
            <NavLink to="/login" className="text-purple-600 font-bold underline ml-1 hover:text-purple-700">
              Sign in
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
