import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';

import {
  addCart,
  getCartByUser,
  removeOnCart
} from '../controllers/cartController.js';

router.route('/').post(protect, addCart);

router.route('/:id').get(protect, getCartByUser).post(protect,removeOnCart);

export default router;