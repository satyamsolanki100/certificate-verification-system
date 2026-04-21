import React from "react";

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <span className="text-8xl font-black">{value[0]}</span>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">
          {title}
        </p>
        <div className="flex items-end justify-between">
          <h4 className="text-4xl font-black text-white tracking-tighter">
            {value}
          </h4>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
              trend.startsWith("+")
                ? "text-green-500 bg-green-500/10"
                : "text-orange-500 bg-orange-500/10"
            }`}
          >
            {trend}
          </span>
        </div>
      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-orange-500 transition-all duration-500 shadow-[0_0_10px_#f97316]" />
    </div>
  );
};

export default StatCard;
