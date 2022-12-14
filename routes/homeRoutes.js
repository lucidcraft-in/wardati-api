import express from 'express';
const router = express.Router();


import { getTopSelling } from '../controllers/stockController.js';
import { getBanner} from '../controllers/bannerPageController.js';
import {
  getCategoriesListHomePage,
  getCategoriesListByPriority,
} from '../controllers/categoryController.js';
 

// Banner
router.route('/banner/:id').get(getBanner);


// Top selling
router.route('/topselling').get(getTopSelling);


// Categories list with sub category and products
router.route('/categories').get(getCategoriesListHomePage);
router.route('/category/priority').get(getCategoriesListByPriority);
export default router;