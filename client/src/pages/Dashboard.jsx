import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import ActivityTable from "../components/ActivityTable";
import { certificateAPI, authAPI } from "../services/api";

const Dashboard = () => {
  // --- Dashboard Data State ---
  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Change Password State ---
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // --- Identity Extraction ---
  const userRole = localStorage.getItem("role")?.toLowerCase();
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Stats (Summary data)
        const statsResponse = await certificateAPI.getStats();

        // 2. Fetch Transactions based on Role (Logic Fix for Data Isolation)
        let activityResponse;
        if (userRole === "admin" || userRole === "university") {
          activityResponse = await certificateAPI.getAll(); // Calls /api/certificates/all
        } else {
          activityResponse = await certificateAPI.getMyVault(); // Calls /api/certificates/my-vault
        }

        const displayData = activityResponse.data || [];

        if (userRole === "admin" || userRole === "university") {
          const { issued, verified, tampered, ipfs } =
            statsResponse.data.summary;
          setStats([
            {
              title: "Total Issued",
              value: issued.toString(),
              icon: "FileText",
              trend: "Live",
            },
            {
              title: "Active Assets",
              value: verified.toString(),
              icon: "CheckCircle",
              trend: "+100%",
            },
            {
              title: "Revoked/Tampered",
              value: tampered.toString(),
              icon: "AlertTriangle",
              trend: "Critical",
            },
            {
              title: "IPFS Anchors",
              value: ipfs.toString(),
              icon: "Database",
              trend: "Syncing",
            },
          ]);
          setTransactions(displayData);
        } else {
          // Student specific stats
          setStats([
            {
              title: "My Certificates",
              value: displayData.length.toString(),
              icon: "Award",
              trend: "Verified",
            },
            {
              title: "Vault Status",
              value: "SECURE",
              icon: "ShieldCheck",
              trend: "Active",
            },
          ]);
          setTransactions(displayData);
        }
      } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userRole]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatusMsg({ type: "", text: "" });
    try {
      await authAPI.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      setStatusMsg({ type: "success", text: "Password Updated Successfully" });
      setPasswords({ current: "", new: "" });
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.response?.data?.message || "Verification Failed",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              {userRole === "student" ? "Student" : "Command"}{" "}
              <span className="text-orange-500">
                {userRole === "student" ? "Vault" : "Center"}
              </span>
            </h1>
            <p className="text-zinc-400 font-medium text-sm uppercase tracking-widest">
              {loading ? "Synchronizing..." : `Welcome, ${userName || "User"}`}
            </p>
          </div>
          <div className="flex items-center gap-3 px-5 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full w-fit">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
            <span className="text-orange-500 text-xs font-black uppercase tracking-widest">
              System Active
            </span>
          </div>
        </div>

        {/* STATS GRID */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${userRole === "admin" ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-8`}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* DATA TABLE SECTION */}
        <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {userRole === "student"
                ? "My Academic Records"
                : "Ledger Activity"}
            </h3>
            <span className="text-xs font-mono text-zinc-500 bg-white/5 px-3 py-1 rounded-full uppercase">
              Entries: {transactions.length}
            </span>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                Retrieving Blockchain Data...
              </p>
            </div>
          ) : (
            <ActivityTable data={transactions} role={userRole} />
          )}
        </div>

        {/* 🔐 SECURITY SECTION */}
        {userRole === "student" && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-zinc-900/60 border border-white/5 rounded-2xl p-10 mt-12 shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <h3 className="text-white text-2xl font-bold mb-3">
                  Security Settings
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Protect your digital identity. Protocol updates require
                  256-bit encryption verification.
                </p>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="flex flex-col gap-3">
                  <label className="text-zinc-500 text-xs font-black uppercase tracking-widest ml-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="bg-black/50 border border-white/10 p-5 rounded-xl text-white outline-none focus:border-orange-500 transition-all placeholder:text-zinc-700"
                    placeholder="Enter Current Password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-zinc-500 text-xs font-black uppercase tracking-widest ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="bg-black/50 border border-white/10 p-5 rounded-xl text-white outline-none focus:border-orange-500 transition-all placeholder:text-zinc-700"
                    placeholder="Enter New Password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-6">
                  <button
                    disabled={isUpdating}
                    className="w-full md:w-auto bg-orange-600 hover:bg-orange-500 text-black font-black px-12 py-5 rounded-xl uppercase text-sm tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-orange-900/20"
                  >
                    {isUpdating
                      ? "Processing..."
                      : "Update Security Credentials"}
                  </button>

                  <AnimatePresence>
                    {statusMsg.text && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-sm font-bold uppercase tracking-widest ${statusMsg.type === "success" ? "text-green-500" : "text-red-500"}`}
                      >
                        {statusMsg.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
