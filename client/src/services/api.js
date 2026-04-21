import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Attach token for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Handle unauthorized errors (Auto Logout)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ---------------- AUTH SERVICE ----------------
export const authAPI = {
  // Login
  login: (data) => API.post("/api/auth/login", data),

  // Access Recovery (OTP Flow)
  forgotPassword: (data) => API.post("/api/auth/forgot-password", data),
  resetPassword: (data) => API.post("/api/auth/reset-password", data),

  // Profile Security
  changePassword: (data) => API.put("/api/auth/change-password", data),
};

// ---------------- CERTIFICATE SERVICE ----------------
const service = {
  // Issuance (Multipart for PDF upload)
  issueCertificate: (formData) =>
    API.post("/api/certificate/issue", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Verification via PDF Upload
  verifyCertificateFile: (formData) =>
    API.post("/api/certificate/verify-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Verification via Hash (Used by PublicVerify.jsx & Dashboard)
  verifyCertificateByHash: (hash) => API.get(`/api/certificate/verify/${hash}`),

  // Management
  getPublicCertificate: (id) => API.get(`/api/certificate/public/${id}`),
  revokeCertificate: (id) => API.put(`/api/certificate/revoke/${id}`),

  // ADMIN: Get all certificates in system
  getAllCertificates: () => API.get("/api/certificate/all"),

  // STUDENT: Get only my certificates (Data Isolation)
  getStudentVault: () => API.get("/api/certificate/my-vault"),

  // Dashboard Stats Aggregation (Smart Role-Based Detection)
  getStats: async () => {
    try {
      const role = localStorage.getItem("role")?.toLowerCase();
      // If student, fetch from vault. If admin, fetch all.
      const endpoint =
        role === "admin" || role === "university"
          ? "/api/certificate/all"
          : "/api/certificate/my-vault";

      const res = await API.get(endpoint);
      const data = res.data || [];

      return {
        data: {
          summary: {
            issued: data.length,
            verified: data.filter((c) => c.status?.toLowerCase() === "active")
              .length,
            tampered: data.filter((c) => c.status?.toLowerCase() === "revoked")
              .length,
            ipfs: data.filter((c) => c.ipfsHash).length,
          },
        },
      };
    } catch (error) {
      console.error("Stats fetch error:", error);
      throw error;
    }
  },

  getRecentActivity: async () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const endpoint =
      role === "admin" || role === "university"
        ? "/api/certificate/all"
        : "/api/certificate/my-vault";

    const res = await API.get(endpoint);
    const data = res.data || [];
    return {
      data: {
        list: data.slice(0, 5),
        chartData: data.map((c) => ({
          name: new Date(c.issuedAt).toLocaleDateString(),
          value: 1,
        })),
      },
    };
  },
};

// ---------------- EXPORT BOTH ----------------
export const certService = service;

export const certificateAPI = {
  issue: service.issueCertificate,
  verifyFile: service.verifyCertificateFile,
  verifyCertificate: service.verifyCertificateByHash,
  revoke: service.revokeCertificate,
  getPublic: service.getPublicCertificate,
  getAll: service.getAllCertificates,
  getMyVault: service.getStudentVault, // Added for Dashboard.jsx
  getStats: service.getStats,
  getRecentActivity: service.getRecentActivity,
};

export default API;
