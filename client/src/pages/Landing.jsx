import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FlameBackground from "../components/FlameBackground";
import CinematicBird from "../components/CinematicBird"; // New Import

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-sans selection:bg-orange-500/30">
      <div className="absolute inset-0 z-0">
        <FlameBackground />
        <CinematicBird /> {/* Added Bird Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 px-4 py-1 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-md"
        >
          <span className="text-orange-400 text-xs font-bold tracking-[0.3em] uppercase">
            Blockchain Secured Verification
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-tight">
          VERIFY{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-500 drop-shadow-[0_0_25px_rgba(251,146,60,0.5)]">
            TRUTH.
          </span>
          <br />
          <span className="text-3xl md:text-5xl opacity-90 uppercase">
            Eliminate Fake Certificates.
          </span>
        </h1>

        <p className="max-w-2xl text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed">
          The ultimate high-integrity platform for academic and professional
          credentials. Powered by immutable ledger technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <button
            onClick={() => navigate("/verify")}
            className="group relative px-8 py-4 bg-orange-600 text-black font-bold rounded-sm transition-all hover:bg-orange-500 hover:scale-105 active:scale-95"
          >
            VERIFY CERTIFICATE
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 border border-orange-500/50 text-orange-400 font-bold rounded-sm backdrop-blur-md transition-all hover:bg-orange-500/10"
          >
            PORTAL LOGIN
          </button>
        </div>
      </motion.main>
    </div>
  );
};

export default Landing;
