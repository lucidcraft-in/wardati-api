import express from 'express'
const router = express.Router()
import {
  checkout,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderByUserId
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, checkout).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders)
router.route('/myorders/:userId').get(protect, getOrderByUserId)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

export default router
