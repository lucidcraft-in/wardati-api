import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductByCategoryPriority,
  getProductByCategory,
  getProductByTrending,
  getProductBySubCategory,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)
router.get('/priority', getProductByCategoryPriority)
router.get('/trending', getProductByTrending);
router.get('/subcategory/:id', getProductBySubCategory);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)

  router.get('/category/:id', getProductByCategory);

export default router
