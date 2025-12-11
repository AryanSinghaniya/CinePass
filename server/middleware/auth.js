import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    console.log("Auth Middleware - req.auth:", req.auth); // Debug log
    const { userId } = req.auth;
    if (!userId) {
        return res.json({ success: false, message: "No user ID found" });
    }
    const user = await clerkClient.users.getUser(userId);

    if (user.privateMetadata.role !== 'admin') {
      return res.json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    next();
  } catch (error) {
    return res.json({ 
      success: false, 
      message: error.message
    });
  }
};