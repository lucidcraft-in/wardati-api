import express from 'express';
const router = express.Router();

import {
  addWishList,
  removeWishList,
  getWishListByUser,
  getWishListByProduct,
} from '../controllers/wishListPageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addWishList);

router
  .route('/:id')
  .delete(protect, removeWishList)
  .get(protect, getWishListByUser);
  
  router.route('/product/:id/:user').get(protect, getWishListByProduct);

export default router;
