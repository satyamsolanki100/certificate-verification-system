import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import { certificateAPI } from "../services/api";

const History = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Real Data from Backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await certificateAPI.getAll();
        setCertificates(res.data || []);
      } catch (err) {
        console.error("Failed to sync ledger:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 2. Filter Logic for the Search Bar
  const filteredCerts = certificates.filter(
    (cert) =>
      cert.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert._id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
              GLOBAL <span className="text-orange-500">LEDGER</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.4em]">
              Synchronized Archive // {certificates.length} Total Records
            </p>
          </div>

          {/* Cinematic Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute -inset-0.5 bg-orange-500/20 rounded-xl blur opacity-20 group-hover:opacity-100 transition duration-500" />
            <input
              type="text"
              placeholder="SEARCH BY NAME, COURSE, OR ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white font-mono text-[10px] uppercase tracking-widest focus:border-orange-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Desktop Table / Mobile Cards */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="p-6 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    Date Issued
                  </th>
                  <th className="p-6 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    Recipient
                  </th>
                  <th className="p-6 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    Certification
                  </th>
                  <th className="p-6 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-black text-orange-500 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-20 text-center">
                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                          Syncing with Mainnet...
                        </span>
                      </td>
                    </tr>
                  ) : (
                    filteredCerts.map((cert, idx) => (
                      <motion.tr
                        key={cert._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-6">
                          <span className="text-xs text-zinc-400 font-mono">
                            {new Date(cert.issuedAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-orange-400 transition-colors">
                              {cert.studentName}
                            </span>
                            <span className="text-[9px] text-zinc-600 font-mono truncate max-w-[150px]">
                              {cert.studentEmail || "NO_EMAIL_RECORDED"}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-xs text-white font-black uppercase tracking-wider">
                            {cert.courseName}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${cert.status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`}
                            />
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                              {cert.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <button
                            onClick={() =>
                              window.open(`/verify?id=${cert._id}`, "_blank")
                            }
                            className="text-[10px] font-black text-orange-500 border border-orange-500/20 px-4 py-2 rounded hover:bg-orange-500 hover:text-black transition-all"
                          >
                            [ VIEW PROOF ]
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && filteredCerts.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-12 h-12 border border-dashed border-white/20 rounded-full flex items-center justify-center mb-4">
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
              </div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
                No matching records found in local node
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;
