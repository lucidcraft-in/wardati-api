import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/authMiddleware.js';

import {
  addCart,
  getCartByUser,
  removeOnCart,
  checkProductInCart
} from '../controllers/cartController.js';

router.route('/').post(protect, addCart).put(protect, removeOnCart);

router.route('/:id').get(protect, getCartByUser);
router.route('/:id/:itemId/:stockId').get(protect, checkProductInCart);

export default router;