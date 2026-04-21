const jwt = require("jsonwebtoken");

/**
 * @desc    Protect routes - Verifies JWT and attaches user to req.user
 */
exports.protect = (req, res, next) => {
  let token;

  // 1. Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token from "Bearer <token>"
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: No security token provided",
    });
  }

  try {
    // 2. Verify token
    // IMPORTANT: Ensure "SECRETKEY" matches the one used in your authController.login
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRETKEY");

    // 3. Attach user data to request object
    // This is CRITICAL for the Student Vault: req.user.email must exist!
    req.user = {
      id: decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role || "student", // Default to student if role is missing
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: Session expired or invalid token",
    });
  }
};

/**
 * @desc    Role Authorization - Restricts access to specific roles (e.g., 'admin')
 * @usage   router.post("/issue", protect, authorize("admin"), issueCert);
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user exists and has a role that matches the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Your role [${req.user?.role || "guest"}] does not have clearance for this operation`,
      });
    }
    next();
  };
};
