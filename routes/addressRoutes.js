import express from 'express';
const router = express.Router();
import {
  createAddress,
  getAddressByUser,
  updateAddress,
  deleteAddress,
} from '../controllers/addressController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createAddress);
router
  .route('/:id')
  .get(protect, getAddressByUser)
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;
