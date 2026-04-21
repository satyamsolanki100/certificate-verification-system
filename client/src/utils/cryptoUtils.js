/**
 * Utility to handle and sanitize cryptographic identifiers.
 * Essential for the 'User POV' and 'Company Verification' flows.
 */

export const extractHash = (input) => {
  if (!input || typeof input !== "string") return "";

  // 1. Trim whitespace to prevent hidden character errors
  const trimmedInput = input.trim();

  // 2. Handle full URLs (e.g., https://gateway.pinata.cloud/ipfs/Qm...)
  // We split by "/" and find the part that looks like an IPFS hash (starts with Qm)
  const parts = trimmedInput.split("/");

  // Look for the CID (usually starts with Qm for IPFS)
  let potentialHash =
    parts.find((p) => p.startsWith("Qm")) || parts[parts.length - 1];

  // 3. Handle URL parameters if they were accidentally included (e.g., Qm...?auth=true)
  const cleanHash = potentialHash.split("?")[0];

  return cleanHash;
};

/**
 * Formats a long hash for display purposes in the UI.
 * Example: QmTsVsosER...VnV7
 */
export const truncateHash = (hash, startLength = 10, endLength = 4) => {
  if (!hash || hash.length < startLength + endLength) return hash;
  return `${hash.substring(0, startLength)}...${hash.substring(hash.length - endLength)}`;
};
