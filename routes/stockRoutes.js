import express from 'express';
const router = express.Router();
import {
  getStocks,
  getStockById,
  getStockByProduct,
  deleteStock,
  createStock,
  updateStock,
} from '../controllers/stockController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
router.route('/').get(getStocks).post(protect, admin, createStock);
router
  .route('/:id')
  .get(getStockById)
  .delete(protect, admin, deleteStock)
  .put(protect, admin, updateStock);

  router.get('/product/:id', getStockByProduct);

export default router;