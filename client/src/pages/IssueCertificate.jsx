import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import { certificateAPI } from "../services/api";

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    courseName: "",
    description: "",
    issuer: "VIVID_CENTRAL_AUTH",
  });

  // New States for Backend Connection
  const [studentEmail, setStudentEmail] = useState("");
  const [studentWallet, setStudentWallet] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      // Constructing FormData for multipart/form-data support (File Upload)
      const data = new FormData();
      data.append("studentName", formData.studentName);
      data.append("courseName", formData.courseName);
      data.append("description", formData.description);
      data.append("studentEmail", studentEmail);
      data.append("studentWallet", studentWallet);
      data.append("certificate", file); // The actual file object

      const res = await certificateAPI.issue(data);

      setStatus({
        type: "success",
        msg: `CERTIFICATE ISSUED SUCCESSFULLY: ${res.data.certificateId || "VERIFIED"}`,
      });

      // Reset fields on success
      setFormData({
        studentName: "",
        courseName: "",
        description: "",
        issuer: "VIVID_CENTRAL_AUTH",
      });
      setStudentEmail("");
      setStudentWallet("");
      setFile(null);
    } catch (err) {
      setStatus({
        type: "error",
        msg: "ISSUE FAILED: MINTING PROTOCOL ERROR",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
            MINT <span className="text-orange-500">NEW ASSET</span>
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em]">
            Authorized Credential Issuance Portal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/40 border border-white/5 p-8 rounded-2xl backdrop-blur-xl shadow-2xl"
          >
            <form onSubmit={handleMint} className="space-y-6">
              {/* Recipient Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">
                  Recipient Identity
                </label>
                <input
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500 outline-none transition-all font-mono text-sm"
                  placeholder="FULL LEGAL NAME"
                />
              </div>

              {/* Student Email - NEW */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500 outline-none transition-all font-mono text-sm"
                  placeholder="STUDENT@INSTITUTION.COM"
                />
              </div>

              {/* Student Wallet - NEW */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">
                  Web3 Wallet Address
                </label>
                <input
                  type="text"
                  value={studentWallet}
                  onChange={(e) => setStudentWallet(e.target.value)}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500 outline-none transition-all font-mono text-sm"
                  placeholder="0x..."
                />
              </div>

              {/* Credential Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">
                  Credential Title
                </label>
                <input
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500 outline-none transition-all font-mono text-sm"
                  placeholder="E.G. BLOCKCHAIN ARCHITECTURE"
                />
              </div>

              {/* File Upload - NEW */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">
                  Certificate Digital Asset (PDF/IMG)
                </label>
                <div className="relative group/file">
                  <input
                    type="file"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500 outline-none transition-all font-mono text-xs file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-orange-500 file:text-black hover:file:bg-orange-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">
                  Validation Details
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:border-orange-500 outline-none transition-all font-mono text-sm"
                  placeholder="BRIEF ACHIEVEMENT SUMMARY..."
                />
              </div>

              {status.msg && (
                <div
                  className={`p-4 rounded-lg text-[10px] font-bold uppercase tracking-widest ${status.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
                >
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 text-black font-black uppercase tracking-[0.3em] rounded-xl shadow-[0_0_30px_rgba(234,88,12,0.2)] transition-all"
              >
                {loading ? "EXECUTING MINT..." : "INITIALIZE ON-CHAIN MINT"}
              </button>
            </form>
          </motion.div>

          {/* Real-time Preview Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-8"
          >
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 ml-1">
              Live Ledger Preview
            </p>

            <div className="relative group">
              <div className="absolute -inset-1 bg-orange-500/20 rounded-lg blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>

              <div className="relative aspect-[1.4/1] w-full bg-zinc-950 border-2 border-orange-500/30 rounded-lg p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
                {/* Certificate Watermark Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                  <div className="w-64 h-64 border-[20px] border-orange-500 rounded-full" />
                </div>

                <div className="flex justify-between items-start z-10">
                  <div className="space-y-1">
                    <div className="w-12 h-12 bg-orange-500 flex items-center justify-center text-black font-black text-xl">
                      V
                    </div>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">
                      Vivid_Authentic
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-mono text-zinc-600 uppercase">
                      Status: PENDING_MINT
                    </p>
                    <p className="text-[8px] font-mono text-zinc-600 uppercase">
                      Wallet:{" "}
                      {studentWallet
                        ? `${studentWallet.slice(0, 6)}...${studentWallet.slice(-4)}`
                        : "NOT_LINKED"}
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-4 z-10">
                  <h2 className="text-zinc-500 text-[10px] uppercase tracking-[0.6em] font-bold">
                    Certificate of Completion
                  </h2>
                  <div className="space-y-1">
                    <h3 className="text-white text-3xl font-black uppercase tracking-tight h-10 truncate">
                      {formData.studentName || "RECIPIENT NAME"}
                    </h3>
                    <div className="h-px bg-orange-500/40 w-3/4 mx-auto" />
                  </div>
                  <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">
                    Has Successfully Completed:
                    <span className="block text-orange-500 mt-2 font-bold truncate">
                      {formData.courseName || "COURSE TITLE"}
                    </span>
                  </p>
                </div>

                <div className="flex justify-between items-end z-10">
                  <div className="text-left space-y-1">
                    <p className="text-[8px] text-zinc-500 uppercase font-mono tracking-widest">
                      Authorized By
                    </p>
                    <p className="text-[10px] text-white font-black uppercase tracking-tighter">
                      SYSTEM_ROOT_ADMIN
                    </p>
                  </div>
                  <div className="w-16 h-16 opacity-30">
                    <div className="grid grid-cols-3 gap-1 w-full h-full">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-orange-500/40" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4 p-4 border border-white/5 rounded-xl bg-black/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-1" />
              <p className="text-[10px] text-zinc-500 font-mono leading-relaxed uppercase">
                Note: Minting will create a permanent cryptographic record on
                the blockchain. Recipient will be notified at{" "}
                {studentEmail || "[EMAIL_PENDING]"}.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IssueCertificate;
