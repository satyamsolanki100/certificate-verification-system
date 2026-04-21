import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🛡️ Get the role saved during Login
  const userRole = localStorage.getItem("role");

  // 📋 Define all possible menu items with role permissions
  const allMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      roles: ["admin", "university", "student"], // Everyone
    },
    {
      name: "Issue Certificate",
      path: "/issue",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      roles: ["admin", "university"], // 🔒 Admin Only
    },
    {
      name: "Ledger History",
      path: "/history",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      roles: ["admin", "university", "student"], // Everyone
    },
    {
      name: "System Settings",
      path: "/settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      roles: ["admin"], // 🔒 Admin Only
    },
  ];

  // 🛡️ Filter the menu so the student doesn't see "Issue Certificate"
  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className="flex flex-col h-full p-6 select-none">
      <div
        className="mb-12 flex items-center gap-3 group cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)]">
          <span className="text-black font-black text-xl">V</span>
        </div>
        <span className="text-white font-black tracking-widest text-lg group-hover:text-orange-500 transition-colors">
          VERIFY.IO
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.name}
              whileHover={{ x: 5 }}
              onClick={() => navigate(item.path)}
              className={`relative px-4 py-4 rounded-xl cursor-pointer flex items-center gap-4 transition-all duration-300 group ${
                isActive
                  ? "bg-orange-500/10 border border-orange-500/30"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full shadow-[0_0_10px_#f97316]"
                />
              )}
              <svg
                className={`w-5 h-5 ${isActive ? "text-orange-500" : "text-zinc-500 group-hover:text-white"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={item.icon}
                />
              </svg>
              <span
                className={`text-sm font-bold uppercase tracking-[0.15em] ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}
              >
                {item.name}
              </span>
            </motion.div>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={() => {
            localStorage.clear(); // 🧹 Clean session on logout
            navigate("/login");
          }}
          className="w-full px-4 py-4 flex items-center gap-4 text-zinc-500 hover:text-red-500 transition-colors group"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest">
            Terminate Session
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
