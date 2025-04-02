import React, { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, User, Apple} from "lucide-react";
import { Eye, EyeOff, Facebook, X, HelpCircle, MessageSquare, Globe2 } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("https://jaitok-api.jaitia.com/accounts/auth/login", {
        email,
        password,
      });
      const { user, token } = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", response.data.data.user.id);
      toast.success("Login successful!");
      login(token)
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
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

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[380px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{t("loginTitle")}</h1>
            <p className="text-gray-500 text-sm">{t("loginSubtitle")}</p>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-sm mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-sm mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-3 mb-3 border rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-50"
            onClick={handleLogin}
            disabled={loading}
          >
            <User className="w-5 h-5" />
            <span>{loading ? "Logging in..." : "Login"}</span>
          </motion.button>
        </motion.div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[380px]"
        >
          <div className="space-y-4">
            {/* QR Code Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 border rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <QrCode className="w-5 h-5" />
              <span>{t("useQR")}</span>
            </motion.button>

            {/* Username/Email Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 border rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <User className="w-5 h-5" />
              <span>{t("useCredentials")}</span>
            </motion.button>

            {/* Facebook Login */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 border rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <Facebook className="w-5 h-5 text-[#0075FA]" />
              <span>{t("continueWith")} Facebook</span>
            </motion.button>

            {/* Google Login */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 border rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>{t("continueWith")} Google</span>
            </motion.button>

            {/* Apple Login */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 border rounded-sm flex items-center justify-center space-x-2 hover:bg-gray-50"
            >
              <Apple className="w-5 h-5" />
              <span>{t("continueWith")} Apple</span>
            </motion.button>
          </div>

          {/* Terms and Sign Up */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              {t("termsText")}{" "}
              <a href="#" className="hover:underline">
                {t("termsLink")}
              </a>{" "}
              {t("andText")}{" "}
              <a href="#" className="hover:underline">
                {t("privacyLink")}
              </a>
              .
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {t("noAccount")}{" "}
              <a
                href="/signup"
                className="text-[#FE2C55] font-semibold hover:underline"
              >
                {t("signUp")}
              </a>
            </p>
          </div>
        </motion.div>
      </div>

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

export default Login;