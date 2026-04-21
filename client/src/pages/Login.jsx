import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FlameBackground from "../components/FlameBackground";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 🛡️ Normalized input to match database records
      const res = await API.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      const { token, user } = res.data;

      // 💾 SECURE STORAGE VAULT
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email); // 🔥 ADDED: Required for Student Dashboard filtering

      // 🚀 HARD REDIRECT: Ensures all context providers and
      // localStorage listeners update correctly
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login Fail Details:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "Invalid credentials or system rejection",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 md:p-10 overflow-hidden">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <FlameBackground />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-10 md:p-16 shadow-2xl">
            <div className="text-center mb-12">
              <motion.h2 className="text-4xl md:text-5xl font-black text-white tracking-[0.2em] uppercase mb-4">
                SECURE <span className="text-orange-500">ACCESS</span>
              </motion.h2>
              <p className="text-zinc-500 text-sm md:text-base tracking-[0.4em] uppercase font-light">
                Identity Verification Portal
              </p>
            </div>

            {/* Error Feedback */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-500 text-center font-mono text-xs uppercase tracking-widest">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-8">
              {/* Email Input */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-orange-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-lg text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-inner"
                  placeholder="name@institution.edu"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-bold text-orange-500 uppercase tracking-widest">
                    Secret Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[10px] font-bold text-zinc-500 hover:text-orange-400 transition-colors uppercase tracking-[0.2em]"
                  >
                    Forgot Access Code?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-lg text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 40px rgba(234, 88, 12, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-5 mt-4 bg-orange-600 hover:bg-orange-500 text-black font-black text-xl uppercase tracking-[0.3em] rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,88,12,0.2)]"
              >
                {isLoading ? "Authorizing..." : "Authorize Entry"}
              </motion.button>
            </form>

            <div className="mt-12 text-center">
              <button
                onClick={() => navigate("/")}
                type="button"
                className="text-zinc-500 hover:text-white text-sm uppercase tracking-[0.3em] transition-all"
              >
                [ Back to Main Terminal ]
              </button>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center px-6 gap-4 opacity-50">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-xs text-white font-mono uppercase tracking-widest">
              System Status: Secure
            </span>
          </div>
          <div className="text-xs text-white font-mono uppercase tracking-widest">
            Protocol: AES-256-GCM / Node_ID: 00-X72
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
