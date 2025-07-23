import express from 'express';

import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

import { getPortFolio, addStockController} from '../controllers/portfolio/portController.js';

router.get('/getportfolio', isAuthenticated,getPortFolio);

router.post('/addStock', isAuthenticated, addStockController);

export default router;