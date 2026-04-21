import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import { certificateAPI } from "../services/api";

const StudentVault = () => {
  const [myCerts, setMyCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pulling the actual logged-in identity
  const userName = localStorage.getItem("userName") || "Guest_User";

  useEffect(() => {
    const fetchMyCerts = async () => {
      try {
        setLoading(true);
        // Calling your real service
        const res = await certificateAPI.getAll();
        const allData = res.data || [];

        // Filter: Only show certificates belonging to this user
        // Note: In production, the backend should ideally handle this filtering
        const filtered = allData.filter(
          (c) => c.studentName?.toLowerCase() === userName.toLowerCase(),
        );

        setMyCerts(filtered);
      } catch (err) {
        console.error("Vault access error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCerts();
  }, [userName]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              MY <span className="text-orange-500">DIGITAL VAULT</span>
            </h1>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">
              Authenticated Identity: {userName} // {myCerts.length} Verified
              Assets
            </p>
          </div>
          <div className="text-[10px] font-mono text-orange-500/50 uppercase tracking-widest hidden md:block">
            Status: Secure Connection 0x77...AF
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse">
              Decrypting Assets...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {myCerts.map((cert, idx) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-600 to-amber-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-700" />

                  {/* Certificate Card */}
                  <div className="relative bg-zinc-900/30 border border-white/5 backdrop-blur-3xl rounded-xl p-8 flex flex-col h-full hover:border-orange-500/30 transition-all duration-500 shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg group-hover:bg-orange-500/10 transition-colors">
                        <svg
                          className="w-6 h-6 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-mono text-zinc-600 uppercase">
                          Serial No.
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">
                          #{cert._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight leading-tight group-hover:text-orange-500 transition-colors">
                      {cert.courseName || cert.title || "Academic Credential"}
                    </h3>

                    <div className="space-y-1 mb-10">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Date of Issuance
                      </p>
                      <p className="text-xs text-zinc-300 font-mono">
                        {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${cert.status === "active" ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`}
                          />
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            {cert.status}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            window.open(`/verify?id=${cert._id}`, "_blank")
                          }
                          className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-white transition-all group/btn"
                        >
                          Verify Ledger
                          <svg
                            className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {myCerts.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/[0.01]"
              >
                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-sm mb-2">
                  Vault Empty
                </p>
                <p className="text-zinc-700 text-[10px] font-mono max-w-xs uppercase leading-loose">
                  No verified credentials found for this identity in the
                  decentralized ledger.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentVault;
