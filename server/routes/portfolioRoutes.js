import express from 'express';

import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

import { getPortFolio, addStockController,updateStockController,deleteStockController, insightsController} from '../controllers/portfolio/portController.js';

router.get('/getportfolio', isAuthenticated,getPortFolio);

router.post('/addStock', isAuthenticated, addStockController);

router.put('/updateStock/:id', isAuthenticated, updateStockController);

router.delete('/deleteStock/:id', isAuthenticated, deleteStockController);

router.get('/getinsights', isAuthenticated, insightsController);


export default router;