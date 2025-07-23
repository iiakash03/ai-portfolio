import { registerUser, loginUser } from '../../services/auth/authService.js';
import generateToken from '../../utils/jwt.js';


export const register = async (req,res) => {
    try {
        const { name, email, password } = req.body;
        const user = await registerUser(email, password);
        const token = generateToken(user.id);
        res.status(201).json({
            message: "Registration successful",
            token,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
};

export const login = async (req,res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser(email, password);
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = generateToken(user.id);
        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
};



