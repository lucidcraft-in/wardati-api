import express from 'express';
const router = express.Router();
import {
  getSubCategory,
  getSubCategoryById,
  deleteSubCategory,
  createSubCategory,
  updateSubCategory,
  getSubCategoryByCategory,
} from '../controllers/subCategoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getSubCategory).post(protect, admin, createSubCategory);
router
  .route('/:id')
  .get(getSubCategoryById)
  .delete(protect, admin, deleteSubCategory)
  .put(protect, admin, updateSubCategory);
  
router.route('/category/:id').get(getSubCategoryByCategory);
    export default router;