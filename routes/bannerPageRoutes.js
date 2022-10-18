import express from 'express';
const router = express.Router();

import { protect, admin } from '../middleware/authMiddleware.js';

import {
  addBanner,
  getBanner,
  deleteBanner,
} from '../controllers/bannerPageController.js';

router.route('/').post(protect, admin, addBanner);

router.route('/:id').delete(protect, admin, deleteBanner);
  


export default router;