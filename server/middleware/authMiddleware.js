import jwt from "jsonwebtoken";
import prisma from '../prisma/client.js'; // Adjust the import path as necessary


export const isAuthenticated = async (req,res,next) => {
    console.log(req.headers.authorization)
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token received:", token); // Debugging line to check token
    if (!token) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET || "topsecret";
        const decoded = jwt.verify(token, secretKey) ;
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user; // Attach full user object from Prisma
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export const isAdmin = async(req, res, next) => {

    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized access' });
        return;
    }
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Forbidden. Admins only.' });
    return;
  }
  next();
};