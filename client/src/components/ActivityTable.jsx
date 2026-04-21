import React from "react";
import { motion } from "framer-motion";
import { certificateAPI } from "../services/api";

const ActivityTable = ({ data = [], role = "student" }) => {
  // Handle Revoke Action (Admin Only)
  const handleRevoke = async (id) => {
    if (
      window.confirm(
        "CRITICAL: Are you sure you want to revoke this certificate? This action is permanent on the ledger.",
      )
    ) {
      try {
        await certificateAPI.revoke(id);
        window.location.reload(); // Refresh to show updated status
      } catch (error) {
        alert("Revocation failed: " + error.message);
      }
    }
  };

  if (data.length === 0) {
    return (
      <div className="py-20 text-center bg-zinc-900/10 rounded-2xl border border-white/5">
        <p className="text-zinc-500 uppercase tracking-widest text-sm font-bold">
          No records found in the secure ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-black">
            <th className="px-6 py-4">IPFS / Hash</th>
            <th className="px-6 py-4">Recipient</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date Issued</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((cert, index) => (
            <motion.tr
              key={cert._id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-900/40 hover:bg-orange-500/5 transition-all group"
            >
              {/* HASH COLUMN */}
              <td className="px-6 py-5 first:rounded-l-xl border-y border-l border-white/5 group-hover:border-orange-500/30">
                <div className="flex flex-col">
                  <span className="font-mono text-orange-500 font-bold text-xs bg-orange-500/10 px-2 py-1 rounded w-fit">
                    {cert.ipfsHash
                      ? cert.ipfsHash.substring(0, 14) + "..."
                      : "PENDING_SYNC"}
                  </span>
                  {cert.transactionHash && (
                    <span className="text-[10px] text-zinc-600 mt-1 font-mono uppercase tracking-tighter">
                      TX: {cert.transactionHash.substring(0, 10)}...
                    </span>
                  )}
                </div>
              </td>

              {/* RECIPIENT COLUMN */}
              <td className="px-6 py-5 border-y border-white/5 group-hover:border-orange-500/30">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base">
                    {cert.studentName || "N/A"}
                  </span>
                  <span className="text-xs text-zinc-500 lowercase">
                    {cert.studentEmail}
                  </span>
                </div>
              </td>

              {/* STATUS COLUMN */}
              <td className="px-6 py-5 border-y border-white/5 group-hover:border-orange-500/30">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter shadow-sm ${
                    cert.status?.toLowerCase() === "active"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20 shadow-green-500/5"
                      : "bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/5"
                  }`}
                >
                  {cert.status || "UNKNOWN"}
                </span>
              </td>

              {/* DATE COLUMN */}
              <td className="px-6 py-5 border-y border-white/5 group-hover:border-orange-500/30 text-zinc-400 font-medium">
                {cert.issuedAt
                  ? new Date(cert.issuedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </td>

              {/* ACTIONS COLUMN */}
              <td className="px-6 py-5 last:rounded-r-xl border-y border-r border-white/5 group-hover:border-orange-500/30 text-right">
                <div className="flex justify-end gap-2">
                  {cert.ipfsHash && (
                    <button
                      onClick={() =>
                        window.open(
                          `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`,
                          "_blank",
                        )
                      }
                      className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                    >
                      View
                    </button>
                  )}

                  <button
                    onClick={() =>
                      (window.location.href = `/verify?hash=${cert.ipfsHash}`)
                    }
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                  >
                    Verify
                  </button>

                  {/* ADMIN-ONLY REVOKE BUTTON */}
                  {(role === "admin" || role === "university") &&
                    cert.status !== "revoked" && (
                      <button
                        onClick={() => handleRevoke(cert._id)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                      >
                        Revoke
                      </button>
                    )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
