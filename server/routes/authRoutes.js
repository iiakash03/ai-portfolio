import express from 'express';
import { register, login} from '../controllers/auth/authController.js';
import { isAuthenticated} from '../middleware/authMiddleware.js';


const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);


export default router;