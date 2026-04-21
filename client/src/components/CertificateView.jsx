import React from "react";
import { motion } from "framer-motion";

const CertificateView = ({ cert }) => {
  if (!cert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white p-1 md:p-16 shadow-2xl relative overflow-hidden"
      id="certificate-print-area"
    >
      {/* Visual Tech Borders */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-orange-500" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-orange-500" />

      {/* Subtle Background Grid/Watermark */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
        <h1 className="text-[15rem] font-black rotate-12">VIVID</h1>
      </div>

      <div className="relative z-10 border-4 border-zinc-100 p-8 md:p-12 h-full flex flex-col items-center text-center">
        {/* Header Section */}
        <div className="mb-12">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-4xl font-black mx-auto mb-4">
            V
          </div>
          <p className="text-orange-500 font-black tracking-[0.5em] text-xs uppercase">
            Official Blockchain Credential
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 mb-16">
          <h2 className="text-zinc-400 uppercase tracking-widest text-sm font-bold">
            This is to certify that
          </h2>
          <h3 className="text-5xl md:text-6xl font-serif italic text-black border-b-2 border-zinc-100 pb-4">
            {cert.studentName}
          </h3>
          <p className="max-w-xl mx-auto text-zinc-600 leading-relaxed font-light text-lg">
            has successfully demonstrated mastery and completed the requirements
            for the professional certification in
          </p>
          <h4 className="text-3xl font-black text-black uppercase tracking-tight">
            {cert.courseName}
          </h4>
        </div>

        {/* Validation Footer */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12 border-t border-zinc-100">
          <div className="text-left space-y-2">
            <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">
              Issuance Date
            </p>
            <p className="text-sm font-mono font-bold">
              {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-zinc-50 border border-zinc-200 p-2">
              {/* This would be a real QR code in production */}
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-orange-500/20 grid grid-cols-2 gap-1">
                  <div className="bg-white/10" />
                  <div className="bg-white/10" />
                  <div className="bg-white/10" />
                  <div className="bg-white/10" />
                </div>
              </div>
            </div>
            <p className="text-[8px] text-zinc-400 mt-2 font-mono uppercase tracking-tighter">
              Verify: {cert._id}
            </p>
          </div>

          <div className="text-right space-y-2">
            <div className="h-px bg-zinc-800 w-32 ml-auto" />
            <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">
              Authorized Signatory
            </p>
            <p className="text-xs font-black uppercase italic">
              Vivid Central Authority
            </p>
          </div>
        </div>

        {/* Cryptographic Proof Footer */}
        <div className="mt-16 w-full text-center">
          <div className="inline-block px-4 py-2 bg-zinc-50 border border-zinc-100 rounded">
            <p className="text-[8px] font-mono text-zinc-500 break-all uppercase tracking-tighter">
              TX_HASH: {cert.ipfsHash || "BLOCK_NOT_FINALIZED_PENDING_SYNC"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateView;
