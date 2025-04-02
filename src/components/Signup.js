import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Facebook, HelpCircle, MessageSquare, User, Apple, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLanguage } from "../context/LanguageContext";

function Signup() {
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    if (name === "firstName" && !value.trim()) error = "First name is required";
    if (name === "lastName" && !value.trim()) error = "Last name is required";
    if (name === "username" && !value.trim()) error = "Username is required";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Valid email is required";
    if (name === "password" && value.length < 8) error = "Password must be at least 8 characters";
    if (name === "role" && !["user", "admin", "moderator"].includes(value)) error = "Invalid role selected";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key]) {
        validationErrors[key] = "This field is required";
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://jaitok-api.jaitia.com/accounts/auth/register",
        formData,
        {
          headers: {
            "content-language": "english",
            "Content-Type": "application/json",
          }
        }
      );
      if (response.data.success) {
        toast.success("Signup successful!");
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
        });
        navigate("/login");
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "An error occurred during signup" });
      toast.error("Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <img
          src="https://lf16-tiktok-web.ttwstatic.com/obj/tiktok-web-common-sg/mtact/static/images/logo_144c91a.png"
          alt="TikTok"
          className="h-8"
        />
        <div className="absolute top-4 right-4 flex items-center space-x-4 text-gray-600">
          <button className="flex items-center hover:text-purple-600">
            <HelpCircle className="w-5 h-5 mr-1" />
            <span>Help</span>
          </button>
          <button className="flex items-center hover:text-purple-600">
            <MessageSquare className="w-5 h-5 mr-1" />
            <span>Feedback</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[380px]"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
            <p className="text-gray-500 text-sm">Join us to get started!</p>
          </div>

          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            {["firstName", "lastName", "username", "email", "password"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "password" && !showPassword ? "password" : "text"}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-sm ${errors[field] ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {field === "password" && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                )}
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>

            ))}
            <div>
              <label className="text-sm text-gray-400">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full p-2 border rounded-sm ${errors.role ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full p-2 border rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <User className="w-5 h-5" />
              <span>{loading ? "Signing up..." : "Sign Up"}</span>
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-2 border rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-2 border rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <Facebook className="w-5 h-5 text-[#1877F2]" />
              <span>Continue with Facebook</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-2 border rounded-full flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <X className="w-5 h-5 text-black" />
              <span>Continue with Twitter</span>
            </motion.button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              By signing up, you agree to our{" "}
              <a href="#" className="hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="mt-2 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#FE2C55] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t flex justify-between items-center">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="hi">हिंदी</option>
        </select>
        <span className="text-gray-500 text-sm">© 2025 TikTok</span>
      </footer>
    </div>
  );
}

export default Signup;