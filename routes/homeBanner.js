import express from 'express';
const router = express.Router();


import { getTopSelling } from '../controllers/stockController.js';
import { getBanner} from '../controllers/bannerPageController.js';

 


// Banner
router.route('/banner/:id').get(getBanner);


// Top selling
router.route('/topselling').get(getTopSelling);

export default router;