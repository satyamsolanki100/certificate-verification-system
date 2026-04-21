import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 overflow-hidden font-sans">
      {/* Sidebar - Fixed width */}
      <aside className="w-72 h-full border-r border-orange-500/10 bg-black/40 backdrop-blur-xl z-50">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Glow Overlay */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Topbar */}
        <header className="h-20 border-b border-orange-500/10 bg-black/20 backdrop-blur-md z-40">
          <Topbar />
        </header>

        {/* Scrollable Content with Motion */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Global Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.4)] z-0" />
    </div>
  );
};

export default DashboardLayout;
