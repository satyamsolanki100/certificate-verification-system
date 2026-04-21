import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertCircle,
  FileSearch,
  Fingerprint,
  ExternalLink,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { certificateAPI } from "../services/api";
import { extractHash } from "../utils/cryptoUtils";

const PublicVerify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 1. Listen for URL parameters (Automated for Dashboard Redirects / QR Codes)
  useEffect(() => {
    const urlHash = searchParams.get("hash");
    if (urlHash) {
      const cleaned = extractHash(urlHash);
      setHash(cleaned);
      handleVerify(null, cleaned);
    }
  }, [searchParams]);

  // 2. Verification Logic
  const handleVerify = async (e, directHash = null) => {
    if (e) e.preventDefault();

    const targetHash = extractHash(directHash || hash);
    if (!targetHash) return;

    setLoading(true);
    setResult(null);

    try {
      // Logic: Hits GET /api/certificate/verify/:hash
      const res = await certificateAPI.verifyCertificate(targetHash);
      setResult(res.data);
    } catch (err) {
      setResult({
        verified: false,
        error: true,
        message:
          err.response?.data?.message ||
          "Digital fingerprint not found in ledger.",
      });
    } finally {
      // Artificial delay for "Cinematic" feel (Optional, remove for instant result)
      setTimeout(() => setLoading(false), 800);
    }
  };

  const resetSearch = () => {
    setResult(null);
    setHash("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-orange-500/30 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* HEADER SECTION */}
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-2"
          >
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Secure Protocol Active
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Verify <span className="text-orange-500 italic">Ledger</span>
          </h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">
            Blockchain Authentication Protocol // v2.0.4
          </p>
        </header>

        {/* SEARCH GATEWAY */}
        <motion.div
          layout
          className="bg-zinc-900/40 border border-white/10 p-3 rounded-3xl backdrop-blur-3xl max-w-3xl mx-auto shadow-2xl"
        >
          <form
            onSubmit={handleVerify}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="relative flex-1 group">
              <Fingerprint
                className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${loading ? "text-orange-500 animate-pulse" : "text-zinc-600 group-focus-within:text-orange-500"}`}
                size={20}
              />
              <input
                className="w-full bg-black/40 p-5 pl-14 rounded-2xl outline-none border border-transparent focus:border-white/10 font-mono text-sm placeholder:text-zinc-700 transition-all text-white"
                placeholder="PASTE IPFS HASH OR CERTIFICATE CID..."
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              disabled={loading || !hash}
              className="bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Scanning...
                </>
              ) : (
                "Verify Identity"
              )}
            </button>
          </form>
        </motion.div>

        {/* RESULTS INTERFACE */}
        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* STATUS CARD */}
              <div
                className={`lg:col-span-4 p-8 rounded-3xl border transition-colors duration-500 ${
                  result.verified
                    ? "bg-green-500/5 border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.05)]"
                    : "bg-red-500/5 border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.05)]"
                }`}
              >
                <div className="flex justify-between items-start mb-8">
                  <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest opacity-60">
                    System Validation
                  </h4>
                  <button
                    onClick={resetSearch}
                    className="text-zinc-600 hover:text-white transition-colors"
                  >
                    <RefreshCcw size={14} />
                  </button>
                </div>

                {result.verified ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-green-500">
                      <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                        <ShieldCheck size={40} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-3xl font-black italic leading-none uppercase tracking-tighter">
                          Authentic
                        </span>
                        <span className="text-[10px] font-bold uppercase opacity-60 mt-1">
                          Integrity Confirmed
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                      Cryptographic match confirmed against the distributed
                      ledger. This document is tamper-proof and verified as
                      original.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-red-500">
                      <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <AlertCircle size={40} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-3xl font-black italic leading-none uppercase tracking-tighter">
                          Unverified
                        </span>
                        <span className="text-[10px] font-bold uppercase opacity-60 mt-1">
                          Data Mismatch
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                      No matching record was found on the blockchain. This
                      credential may be invalid, revoked, or non-existent in
                      this ledger.
                    </p>
                  </div>
                )}
              </div>

              {/* DATA CARD */}
              <div className="lg:col-span-8 bg-zinc-900/40 border border-white/5 rounded-3xl p-10 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                {/* Background Decorative Icon */}
                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                  <FileSearch size={300} />
                </div>

                <h3 className="text-xl font-bold mb-10 flex items-center gap-3 text-white">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${result.verified ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"}`}
                  />
                  Certificate Metadata
                </h3>

                {result.verified ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 relative z-10">
                    <DetailItem
                      label="Recipient Name"
                      value={result.studentName}
                    />
                    <DetailItem
                      label="Issuing Institution"
                      value={result.universityName}
                    />
                    <DetailItem
                      label="Credential Type"
                      value={result.courseName}
                    />
                    <DetailItem
                      label="Issue Date"
                      value={new Date(result.issuedAt).toLocaleDateString(
                        undefined,
                        { dateStyle: "long" },
                      )}
                    />

                    <div className="md:col-span-2 space-y-3 pt-8 border-t border-white/5 mt-4">
                      <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block opacity-70">
                        Digital Signature (Blockchain Hash)
                      </label>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-orange-500/80 bg-orange-500/5 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-all">
                        <span className="truncate flex-1 tracking-tight">
                          {result.transactionHash || result.ipfsHash}
                        </span>
                        <ExternalLink
                          size={14}
                          className="flex-shrink-0 cursor-pointer hover:text-white transition-colors"
                          onClick={() =>
                            window.open(
                              `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`,
                              "_blank",
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 py-12">
                    <AlertCircle size={48} className="mb-4 opacity-20" />
                    <p className="italic text-sm font-medium uppercase tracking-widest text-zinc-500">
                      Null Data Returned
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="space-y-1.5 relative z-10">
    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block opacity-70">
      {label}
    </label>
    <p className="text-white text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text">
      {value || "Not Specified"}
    </p>
  </div>
);

export default PublicVerify;
