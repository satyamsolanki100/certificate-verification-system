import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FlameBackground from "../components/FlameBackground";
import API from "../services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // 1. Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setMessage({
        type: "success",
        text: "Security OTP dispatched to your email.",
      });
      setStep(2);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Email verification failed.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await API.post("/api/auth/reset-password", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: newPassword,
      });
      setMessage({
        type: "success",
        text: "Vault access restored. Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid OTP or Reset Failed.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FlameBackground />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2 text-center">
            RECOVER <span className="text-orange-500">ACCESS</span>
          </h2>
          <p className="text-zinc-500 text-xs text-center uppercase tracking-[0.3em] mb-8">
            Secure Protocol Initialization
          </p>

          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`mb-6 p-4 rounded-xl border text-xs text-center uppercase tracking-widest ${message.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"}`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 ml-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500/50 outline-none transition-all"
                  placeholder="Enter your portal email"
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full py-4 bg-orange-600 text-black font-black uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Send Security OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 ml-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white font-mono text-center text-2xl tracking-[0.5em] focus:border-orange-500/50 outline-none transition-all"
                  placeholder="000000"
                  maxLength="6"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2 ml-1">
                  New Secret Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500/50 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                disabled={isLoading}
                className="w-full py-4 bg-orange-600 text-black font-black uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all disabled:opacity-50"
              >
                {isLoading ? "Updating Vault..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-zinc-500 hover:text-white text-[10px] uppercase tracking-widest transition-all"
            >
              [ Return to Login ]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
