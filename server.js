import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import subCategoryRoutes from './routes/subCategoryRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import banner from './routes/bannerPageRoutes.js';
import home from './routes/homeBanner.js';
import wishList from './routes/wishListPageRoute.js';
import cart from './routes/cartPageRoutes.js';
 

const app = express();
dotenv.config();
app.use(cors());
connectDB();

app.use(express.json());

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promotion', promotionRoutes);
app.use('/api/subcategory', subCategoryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/banner', banner);
app.use('/api/home', home);
app.use('/api/wishlist', wishList);
app.use('/api/cart', cart);
 

  app.get('/', (req, res) => {
    res.send('API is running....');
  });

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
