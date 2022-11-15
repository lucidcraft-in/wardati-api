import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Stock from '../models/stockModel.js';
import mongoose from 'mongoose';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
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

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword });
  // .limit(pageSize)
  // .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.aggregate([
    {
      $lookup: {
        from: 'stocks',
        localField: '_id',
        foreignField: 'product',
        as: 'stock_items',
      },
    },
  ]);

  const byUser = product.find((list) => list._id.toString() === req.params.id);

  if (byUser) {
    res.json(byUser);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Fetch products by category
// @route   GET /api/products/category/:id
// @access  Public
const getProductByCategory = asyncHandler(async (req, res) => {
  let page = 0;
  let count = 0;
  let pageSize = 0;

  let allParams = req.query;

  const filter = {};

  let sort = {};
  var searchVal = '';
  var pipeline = [
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product_items',
      },
    },
  ];

  //  check if sort contain
  if (allParams.sort) {
    let SortVal;
    if (allParams.sort.replace(/['"]+/g, '') == 'asc') {
      SortVal = 1;
    } else {
      SortVal = -1;
    }

    sort = { sellingPrice: SortVal };
    pipeline.push({ $sort: sort });
  }

  //   // check if price range contain
  if (allParams.price_range) {
    let rangeStratVal;
    let rangeEndVal;
    let rangeArray;

    rangeArray = allParams.price_range.split('-');

    rangeStratVal = parseInt(rangeArray[0].replace(/['"]+/g, ''));
    rangeEndVal = parseInt(rangeArray[1].replace(/['"]+/g, ''));

    // check product name search parameter

    if (allParams.spn) {
      searchVal = allParams.spn.replace(/['"]+/g, '');

      filter.matchval = {
        category: mongoose.Types.ObjectId(req.params.id),

        sellingPrice: { $gte: rangeStratVal, $lte: rangeEndVal },

        'product_items.name': { $regex: searchVal, $options: 'i' },
      };
    } else {
      // set value for match
      filter.matchval = {
        category: mongoose.Types.ObjectId(req.params.id),
        sellingPrice: { $gte: rangeStratVal, $lte: rangeEndVal },
        // product:mongoose.Types.ObjectId("634fc0adad67a6b550f04061")
      };
    }

    // push to pipeline array
    pipeline.push({ $match: filter.matchval });
  } else {
    // check product name search parameter
    if (allParams.spn) {
      searchVal = allParams.spn.replace(/['"]+/g, '');
      filter.matchval = {
        category: mongoose.Types.ObjectId(req.params.id),
        'product_items.name': { $regex: searchVal, $options: 'i' },
      };
    } else {
      filter.matchval = {
        category: mongoose.Types.ObjectId(req.params.id),
      };
    }
    pipeline.push({ $match: filter.matchval });
    //
  }


  // // get value from stock using aggrigate
  const products = await Stock.aggregate(pipeline);

  if (products) {
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getProductBySubCategory = asyncHandler(async (req, res) => {
  try {
    let page = 0;
    let count = 0;
    let pageSize = 0;

    let allParams = req.query;

    const filter = {};

    let sort = {};
    var searchVal = '';
    var pipeline = [
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product_items',
        },
      },
    ];

    //  check if sort contain
    if (allParams.sort) {
      let SortVal;
      if (allParams.sort.replace(/['"]+/g, '') == 'asc') {
        SortVal = 1;
      } else {
        SortVal = -1;
      }

      sort = { sellingPrice: SortVal };
      pipeline.push({ $sort: sort });
    }

    //   // check if price range contain
    if (allParams.price_range) {
      let rangeStratVal;
      let rangeEndVal;
      let rangeArray;

      rangeArray = allParams.price_range.split('-');

      rangeStratVal = parseInt(rangeArray[0].replace(/['"]+/g, ''));
      rangeEndVal = parseInt(rangeArray[1].replace(/['"]+/g, ''));

      // check product name search parameter

      if (allParams.spn) {
        searchVal = allParams.spn.replace(/['"]+/g, '');

        filter.matchval = {
          subCategory: mongoose.Types.ObjectId(req.params.id),

          sellingPrice: { $gte: rangeStratVal, $lte: rangeEndVal },

          'product_items.name': { $regex: searchVal, $options: 'i' },
        };
      } else {
        // set value for match
        filter.matchval = {
          subCategory: mongoose.Types.ObjectId(req.params.id),
          sellingPrice: { $gte: rangeStratVal, $lte: rangeEndVal },
          // product:mongoose.Types.ObjectId("634fc0adad67a6b550f04061")
        };
      }

      // push to pipeline array
      pipeline.push({ $match: filter.matchval });
    } else {
      // check product name search parameter
      if (allParams.spn) {
        searchVal = allParams.spn.replace(/['"]+/g, '');
        filter.matchval = {
          subCategory: mongoose.Types.ObjectId(req.params.id),
          'product_items.name': { $regex: searchVal, $options: 'i' },
        };
      } else {
        filter.matchval = {
          subCategory: mongoose.Types.ObjectId(req.params.id),
        };
      }
      pipeline.push({ $match: filter.matchval });
      //
    }
console.log(pipeline);
    // // get value from stock using aggrigate
   const products = await Stock.aggregate(pipeline);

    if (products) {
      res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(500).json({error});
  }
});

const getProductByTrending = asyncHandler(async (req, res) => {
 

  const products = await Stock.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $match: { 'product.isTrending': true } },
  ]).limit(10);

  if (products) {
    res.json({products});
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const getProductByCategoryPriority = asyncHandler(async (req, res) => {
 

  const category = await Category.find().sort({ priority: 1 }).limit(3);
 
  const products = [];

  for (let i = 0; i < category.length; i++) {

      const stocks = await Stock.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $match: { category: category[i]['_id'] } },
      ]).limit(10);
   

    // const result = await Product.find({
    //   $and: [{ category: category[i]['_id'] } ],
    // }).limit(10);

    if (stocks.length > 0) {
      products.push({
        stocks: stocks,
        category: category[i]['categoryName'],
        title: category[i]['title'],
      });
    }
  }

  res.json({ products });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();

    await Stock.deleteMany({ product: req.params.id });

    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,

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
    isTrending: req.body.isTrending,
     
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,

    description,
    imagesArray,
    brand,
    category,
    selectedSubCategory,
    countInStock,
    stockArray,
    promotionPercentage,
    isTrending,
    priceRangeStart,
    priceRangeEnd,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;

    product.description = description;
    product.images = imagesArray;
    product.brand = brand;
    product.category = category;
    product.subcategory = selectedSubCategory;
    product.countInStock = countInStock;
    product.stock = stockArray;
    product.promotionPercentage = promotionPercentage;
    product.isTrending = isTrending;
   
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

const productFilterAndSort = asyncHandler(async (req, res) => {
  // const products = await Product.find({
  //   category: req.params.id,
  // });

  // get all parameters
  let allParams = req.query;

  const filter = {};

  let sort = {};

  var pipeline = [
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product_items',
      },
    },
  ];

  //  check if sort contain
  if (allParams.sort) {
    let SortVal;
    if (allParams.sort.replace(/['"]+/g, '') == 'asc') {
      SortVal = 1;
    } else {
      SortVal = -1;
    }

    sort = { sellingPrice: SortVal };
    pipeline.push({ $sort: sort });
  }

  //   // check if price range contain
  if (allParams.price_range) {
    let rangeStratVal;
    let rangeEndVal;
    let rangeArray;

    rangeArray = allParams.price_range.split('-');

    rangeStratVal = parseInt(rangeArray[0].replace(/['"]+/g, ''));
    rangeEndVal = parseInt(rangeArray[1].replace(/['"]+/g, ''));

    // set value for match
    filter.matchval = {
      category: mongoose.Types.ObjectId(req.params.id),
      sellingPrice: { $gte: rangeStratVal, $lte: rangeEndVal },
    };

    // push to pipeline array
    pipeline.push({ $match: filter.matchval });
  } else {
    filter.matchval = { category: mongoose.Types.ObjectId(req.params.id) };
    pipeline.push({ $match: filter.matchval });
    //
  }

  // // get value from stock using aggrigate
  const products = await Stock.aggregate(pipeline);

  if (products) {
    //  console.log(products)
    res.json(products);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const nearestProducts = asyncHandler(async (req, res) => {

  try {
     const afterProduct = await Product.find({
       _id: { $gt: req.params.id },
     }).limit(1);
    
      const beforeProduct = await Product.find({
        _id: { $lt: req.params.id },
      }).limit(1);


     res.status(200).json({ afterProduct, beforeProduct });
  } catch (error) {
     res.status(500).json(error);
  }
});

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
  getProductByTrending,
  getProductBySubCategory,
  productFilterAndSort,
  nearestProducts,
};
