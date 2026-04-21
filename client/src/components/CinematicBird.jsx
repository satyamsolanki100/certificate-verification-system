import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DroppedLetter = ({ x, y, color }) => (
  <motion.div
    initial={{ y: y, x: x, opacity: 0, scale: 0.5, rotate: -20 }}
    animate={{
      y: y + 700,
      x: x + (Math.random() * 150 - 75), // Wind drift
      opacity: [0, 1, 1, 0],
      rotate: [0, 45, -45, 90], // Tumbling effect
      scale: 1.2,
    }}
    transition={{
      duration: 6,
      ease: [0.45, 0.05, 0.55, 0.95],
    }}
    className="absolute z-20 w-20 h-28 border backdrop-blur-xl rounded-sm flex flex-col items-center justify-between p-3 pointer-events-none"
    style={{
      borderColor: `${color}90`,
      backgroundColor: `rgba(10, 10, 10, 0.6)`,
      boxShadow: `0 0 35px ${color}30, inset 0 0 10px ${color}20`,
    }}
  >
    {/* Letter/Certificate Branding */}
    <div className="w-full flex justify-between items-start">
      <div className="w-4 h-4 rounded-full border border-orange-500/50" />
      <div className="w-8 h-[1px] bg-white/20" />
    </div>

    <div className="flex flex-col items-center">
      <span
        className="text-[10px] font-black uppercase tracking-[0.2em] text-center"
        style={{ color: color }}
      >
        OFFICIAL
        <br />
        VERIFIED
      </span>
      <div
        className="w-12 h-[1px] mt-2 opacity-30"
        style={{ backgroundColor: color }}
      />
    </div>

    {/* Bottom Stamp Area */}
    <div className="w-full flex justify-end">
      <div
        className="w-6 h-6 border rotate-45"
        style={{ borderColor: `${color}60` }}
      >
        <div className="w-full h-full bg-orange-500/10 animate-pulse" />
      </div>
    </div>
  </motion.div>
);

const BirdInstance = ({ config, onDrop }) => {
  const [hasDropped, setHasDropped] = useState(false);

  return (
    <motion.div
      initial={{ x: "-30vw", y: config.startY, opacity: 0 }}
      animate={{
        x: "130vw",
        y: config.endY,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: config.delay,
      }}
      onUpdate={(latest) => {
        const currentX = parseFloat(latest.x);
        // Trigger drop near center (between 40% and 60% of path)
        if (!hasDropped && currentX > 40 && currentX < 60) {
          onDrop(
            window.innerWidth * (currentX / 100),
            parseFloat(latest.y),
            config.color,
          );
          setHasDropped(true);
        }
        // Reset when it wraps around
        if (currentX < -10 && hasDropped) {
          setHasDropped(false);
        }
      }}
      className="relative flex items-center justify-center"
    >
      {/* Cinematic Glow Trails */}
      <div
        className="absolute w-40 h-10 blur-[60px] rounded-full opacity-20"
        style={{ backgroundColor: config.color, transform: "skewX(-30deg)" }}
      />

      {/* Detailed Bird Silhouette (V-Shape Wing Span) */}
      <svg
        width="100"
        height="50"
        viewBox="0 0 120 60"
        className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      >
        <motion.path
          fill={config.color}
          animate={{
            d: [
              "M10 30 Q30 0 60 30 Q90 0 110 30 L60 35 Z", // Broad wings up
              "M10 30 Q30 60 60 30 Q90 60 110 30 L60 25 Z", // Broad wings down
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: config.wingSpeed,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
};

const CinematicBird = () => {
  const [drops, setDrops] = useState([]);

  // Increased bird count and varied paths for a "flock" feel
  const birdConfigs = useMemo(
    () => [
      {
        id: 1,
        startY: "10vh",
        endY: "25vh",
        duration: 12,
        delay: 0,
        wingSpeed: 1.2,
        color: "#fb923c",
      },
      {
        id: 2,
        startY: "30vh",
        endY: "15vh",
        duration: 16,
        delay: 5,
        wingSpeed: 1.5,
        color: "#fbbf24",
      },
      {
        id: 3,
        startY: "50vh",
        endY: "65vh",
        duration: 14,
        delay: 3,
        wingSpeed: 1.3,
        color: "#ffffff",
      },
      {
        id: 4,
        startY: "70vh",
        endY: "45vh",
        duration: 20,
        delay: 8,
        wingSpeed: 1.8,
        color: "#f87171",
      },
      {
        id: 5,
        startY: "20vh",
        endY: "50vh",
        duration: 15,
        delay: 12,
        wingSpeed: 1.4,
        color: "#fb923c",
      },
      {
        id: 6,
        startY: "80vh",
        endY: "20vh",
        duration: 19,
        delay: 1,
        wingSpeed: 1.6,
        color: "#fbbf24",
      },
    ],
    [],
  );

  const handleDrop = (x, y, color) => {
    const id = Math.random();
    setDrops((prev) => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setDrops((prev) => prev.filter((d) => d.id !== id));
    }, 6000);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {birdConfigs.map((config) => (
        <BirdInstance key={config.id} config={config} onDrop={handleDrop} />
      ))}

      <AnimatePresence>
        {drops.map((drop) => (
          <DroppedLetter
            key={drop.id}
            x={drop.x}
            y={drop.y}
            color={drop.color}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CinematicBird;
