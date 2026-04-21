import React, { useMemo } from "react";
import { motion } from "framer-motion";

const FloatingCertificate = ({
  delay,
  duration,
  xPos,
  size,
  opacity,
  blur,
  drift,
}) => {
  return (
    <motion.div
      initial={{ y: "110vh", x: xPos, rotate: 0, opacity: 0 }}
      animate={{
        y: "-30vh",
        x: [xPos, drift, xPos], // Horizontal random drifting
        rotate: [0, 15, -15, 0],
        opacity: [0, opacity, opacity, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
      style={{
        filter: `blur(${blur}px)`,
        width: size,
        height: size * 1.3,
      }}
      className="absolute flex flex-col justify-between p-4 border border-orange-500/40 bg-orange-500/5 backdrop-blur-xl rounded-md pointer-events-none shadow-[0_0_20px_rgba(251,146,60,0.2)]"
    >
      {/* Visual content of the floating card */}
      <div className="w-full h-1 bg-orange-500/60 mb-2 rounded-full" />
      <div className="w-2/3 h-[2px] bg-white/10 mb-2" />
      <div className="w-full h-[2px] bg-white/10 mb-2" />

      <div className="mt-auto flex flex-col items-center">
        <div className="w-6 h-6 border-2 border-orange-500/50 rounded-full flex items-center justify-center mb-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        </div>
        <span className="text-[8px] text-orange-400 font-black uppercase tracking-[0.2em]">
          Verified
        </span>
      </div>
    </motion.div>
  );
};

const FlameBackground = () => {
  const certificates = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const xOrigin = Math.random() * 90; // Spread across 90% of width
      return {
        id: i,
        delay: Math.random() * -20, // Negative delay starts them at different heights immediately
        duration: 20 + Math.random() * 20,
        xPos: `${xOrigin}%`,
        drift: `${xOrigin + (Math.random() * 20 - 10)}%`, // Drift +/- 10% from origin
        size: 80 + Math.random() * 60, // Larger size for visibility
        opacity: 0.3 + Math.random() * 0.4, // Higher opacity
        blur: Math.random() * 2,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden z-0">
      {/* Background Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(124,45,18,0.2)_0%,transparent_70%)]" />

      {/* Floating Elements */}
      <div className="relative w-full h-full">
        {certificates.map((cert) => (
          <FloatingCertificate key={cert.id} {...cert} />
        ))}
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
    </div>
  );
};

export default FlameBackground;
