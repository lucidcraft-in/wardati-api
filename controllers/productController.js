import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Category from '../models/categoryModel.js'
import Stock from '../models/stockModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})




// @desc    Fetch products by category
// @route   GET /api/products/category/:id
// @access  Public
const getProductByCategory = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
   const products = await Product.find({
     category: product.category,
     _id: { $ne: req.params.id },
   });

  if (products) {
    res.json(products);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
})

const getProductByCategoryPriority = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
  
 

  
  const category = await Category.find().limit(3);
  const categoryId = [];
  const products = [];


  for (let i = 0; i < category.length; i++) {
   
    categoryId.push(category[i]['_id'])
   
    const result = await Product.find(
      {
        $and: [{ category: category[i]['_id'] }, { ...keyword }],
      }
     
    );
    
  
    if (result.length >0) {
      products.push({
        product: result,
        category: category[i]['categoryName'],
        title: category[i]['title'],
      });
    }
    
  }

  

  res.json({products});
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()

await Stock.deleteMany({ product: req.params.id });

    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
console.log(req.body.selectedSubCategory);
    

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    sellingPrice: req.body.sellingPrice,
    user: req.user._id,
    images: req.body.imagesArray,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    stock: req.body.stockArray,
    numReviews: 0,
    description: req.body.description,
    category: req.body.category,
    subcategory: req.body.selectedSubCategory,
    promotionPercentage: req.body.promotionPercentage,
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    sellingPrice,
    description,
    imagesArray,
    brand,
    category,
    selectedSubCategory,
    countInStock,
    stockArray,
    promotionPercentage,
  } = req.body;

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.sellingPrice = sellingPrice;
    product.description = description
    product.images = imagesArray;
    product.brand = brand
    product.category = category
     product.subcategory = selectedSubCategory;
    product.countInStock = countInStock
     product.stock = stockArray;
    product.promotionPercentage = promotionPercentage;

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductByCategoryPriority,
  getProductByCategory,
};
