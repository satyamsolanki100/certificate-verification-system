import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const userName = localStorage.getItem("userName") || "Admin_Root";

  const SettingRow = ({ title, desc, children }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 gap-4">
      <div className="max-w-md">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">
          {title}
        </h3>
        <p className="text-xs text-zinc-500 font-mono leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
            SYSTEM <span className="text-orange-500">CONFIGURATION</span>
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em]">
            Hardware ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}
          </p>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/20 border border-white/5 rounded-2xl p-8 mb-8 backdrop-blur-xl"
        >
          <div className="flex items-center gap-6 mb-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-orange-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative w-24 h-24 bg-black border-2 border-orange-500/30 rounded-full flex items-center justify-center text-3xl font-black text-orange-500">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase">
                {userName}
              </h2>
              <p className="text-xs text-orange-500 font-mono tracking-widest uppercase">
                Access Level: Level 5 Administrator
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <SettingRow
              title="Two-Factor Authentication"
              desc="Add an extra layer of security to your account by requiring a digital signature for every login."
            >
              <button className="px-4 py-2 border border-orange-500/40 text-orange-400 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/10 transition-all">
                Configure 2FA
              </button>
            </SettingRow>

            <SettingRow
              title="Ledger Notifications"
              desc="Receive real-time alerts whenever a certificate is verified or a block is finalized."
            >
              <div
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${notifications ? "bg-orange-600 shadow-[0_0_15px_#ea580c80]" : "bg-zinc-800"}`}
              >
                <motion.div
                  animate={{ x: notifications ? 26 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </div>
            </SettingRow>

            <SettingRow
              title="Data Retention"
              desc="Configure how long local logs are stored before being archived to the immutable blockchain."
            >
              <select className="bg-black border border-white/10 text-xs text-zinc-300 px-3 py-2 rounded focus:border-orange-500 outline-none">
                <option>30 Days</option>
                <option>90 Days</option>
                <option>Indefinite</option>
              </select>
            </SettingRow>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border border-red-900/30 bg-red-950/5 rounded-2xl p-8"
        >
          <h3 className="text-red-500 text-sm font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Terminal Action: Purge
          </h3>
          <p className="text-xs text-red-900/60 font-mono mb-6 uppercase">
            Executing these actions will permanently revoke local session data
            and crypto-keys.
          </p>
          <button className="px-6 py-3 bg-red-950/20 border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all">
            Deactivate Identity
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
