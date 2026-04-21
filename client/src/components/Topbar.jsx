import React from "react";

const Topbar = () => {
  return (
    <div className="h-full px-8 flex items-center justify-between">
      {/* System Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
          <span className="text-[10px] font-mono text-orange-500 uppercase tracking-[0.3em]">
            Network: Mainnet-Beta
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
          Relay: 0.042ms
        </span>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-6">
        {/* Alerts Icon */}
        <button className="relative p-2 text-zinc-400 hover:text-orange-500 transition-colors">
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-black" />
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/5">
          <div className="text-right">
            <p className="text-sm font-black text-white uppercase tracking-tighter">
              Admin_Root
            </p>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">
              Superuser Privileges
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border border-orange-500/50 p-0.5">
            <div className="w-full h-full bg-zinc-800 rounded-full flex items-center justify-center text-orange-500 font-black">
              AR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
