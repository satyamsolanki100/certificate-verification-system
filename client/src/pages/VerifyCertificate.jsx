import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  AlertCircle,
  FileSearch,
  Fingerprint,
  Calendar,
  User,
  School,
  ExternalLink,
} from "lucide-react";
import { certService } from "../services/api";

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Auto-fill hash if coming from Dashboard
  useEffect(() => {
    const urlHash = searchParams.get("hash");
    if (urlHash) setHash(urlHash);
  }, [searchParams]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!hash) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await certService.verifyCertificate(hash);
      // Assuming res.data contains { verified: true, studentName: "...", university: "...", issuedAt: "..." }
      setResult(res.data);
    } catch (err) {
      setResult({ status: "Invalid Hash", error: true, verified: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 px-4 py-10">
      <header className="text-center md:text-left">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
          Verification{" "}
          <span className="text-orange-500 font-outline">Ledger</span>
        </h2>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">
          Public Authentication Gateway // Node: VIVID-X7
        </p>
      </header>

      {/* SEARCH INPUT AREA */}
      <div className="bg-zinc-900/40 border border-white/10 p-2 rounded-2xl backdrop-blur-xl">
        <form
          onSubmit={handleVerify}
          className="flex flex-col md:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Fingerprint
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600"
              size={24}
            />
            <input
              className="w-full bg-transparent p-6 pl-14 outline-none text-white text-lg font-mono placeholder:text-zinc-700"
              placeholder="ENTER CERTIFICATE HASH OR ID..."
              value={hash}
              onChange={(e) => setHash(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-500 text-black px-12 py-5 rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? "SCANNING..." : "SCAN LEDGER"}
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* LEFT: VALIDATION STATUS */}
            <div className="lg:col-span-4 space-y-6">
              <div
                className={`p-8 rounded-2xl border-l-8 backdrop-blur-md ${result.verified ? "bg-green-500/5 border-green-500" : "bg-red-500/5 border-red-500"}`}
              >
                <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">
                  Ledger Identity Status
                </h4>
                {result.verified ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-500">
                      <ShieldCheck size={40} strokeWidth={2.5} />
                      <span className="text-3xl font-black italic">
                        AUTHENTIC
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      Cryptographic match confirmed on the blockchain. This
                      document is immutable and verified.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-red-500">
                      <AlertCircle size={40} />
                      <span className="text-3xl font-black italic">
                        FAILURE
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 font-medium">
                      The provided fingerprint does not match any record in the
                      global decentralized ledger.
                    </p>
                  </div>
                )}
              </div>

              {/* IPFS PREVIEW BOX */}
              {result.verified && (
                <button
                  onClick={() =>
                    window.open(
                      `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`,
                      "_blank",
                    )
                  }
                  className="w-full bg-zinc-900/60 border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:border-orange-500/50 transition-all"
                >
                  <FileSearch
                    size={40}
                    className="text-zinc-600 group-hover:text-orange-500 transition-colors"
                  />
                  <span className="text-xs font-black text-white uppercase tracking-widest">
                    Open Original IPFS File
                  </span>
                </button>
              )}
            </div>

            {/* RIGHT: CERTIFICATE DETAILS (The Who, When, Where) */}
            <div className="lg:col-span-8">
              {result.verified ? (
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-10 h-full backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-12">
                    <h3 className="text-2xl font-bold text-white">
                      Certificate Metadata
                    </h3>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 font-black uppercase">
                        Blockchain Hash
                      </p>
                      <p className="text-[10px] text-orange-500 font-mono">
                        {hash.substring(0, 20)}...
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* RECIPIENT */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                        <User size={14} /> Recipient Name
                      </div>
                      <p className="text-white text-2xl font-black tracking-tight underline decoration-orange-500/30 underline-offset-8">
                        {result.studentName}
                      </p>
                    </div>

                    {/* UNIVERSITY */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                        <School size={14} /> Issuing University
                      </div>
                      <p className="text-white text-xl font-bold uppercase tracking-tighter">
                        {result.universityName ||
                          "Authorized Academic Institution"}
                      </p>
                    </div>

                    {/* DATE */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                        <Calendar size={14} /> Issued Date
                      </div>
                      <p className="text-zinc-200 font-mono text-lg">
                        {new Date(result.issuedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* SECURITY LEVEL */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                        <ShieldCheck size={14} /> Security Protocol
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black rounded-full border border-green-500/20">
                          LEVEL 4 AI-ENCRYPTED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col items-center justify-center p-10 text-center">
                  <AlertCircle size={60} className="text-red-900 mb-6" />
                  <h3 className="text-white text-xl font-bold mb-2">
                    Metadata Retrieval Failed
                  </h3>
                  <p className="text-zinc-500 text-sm max-w-sm">
                    The system could not retrieve identity information because
                    the hash does not exist in our secure ledger.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerifyCertificate;
