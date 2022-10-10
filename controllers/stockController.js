import asyncHandler from 'express-async-handler';
import Stock from '../models/stockModel.js';
import Product from '../models/productModel.js';


// @desc    Fetch all stocks
// @route   GET /api/stocks
// @access  Public
const getStocks = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  // const keyword = req.query.keyword
  //   ? {
  //       name: {
  //         $regex: req.query.keyword,
  //         $options: 'i',
  //       },
        
  //     }
  //   : {};
  
 

  const count = await Stock.countDocuments({  });
  const stocks = await Stock.aggregate([
   
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product_',
      },
    },
  ])
    // .limit(pageSize)
    // .skip(pageSize * (page - 1));

  res.json({ stocks, page, pages: Math.ceil(count / pageSize) });
})




// @desc    Fetch single Stock
// @route   GET /api/Stocks/:id
// @access  Public
const getStockById = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);
 
   const product = await Product.findById(stock.product);
 
  if (stock) {
    res.json({ stock, product});
  } else {
    res.status(404);
    throw new Error('Stock not found');
  }
})


// @desc    Fetch  Stocks
// @route   GET /api/Stocks/product/:id
// @access  Public
const getStockByProduct = asyncHandler(async (req, res) => {
  const stocks = await Stock.find({product :req.params.id});
 
  
 
  if (stocks) {
    res.json({ stocks});
  } else {
    res.status(404);
    throw new Error('Stock not found');
  }
})



// @desc    Delete a stock
// @route   DELETE /api/stocks/:id
// @access  Private/Admin
const deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id)

  if (stock) {
    await stock.remove()
    res.json({ message: 'stock removed' })
  } else {
    res.status(404)
    throw new Error('stock not found')
  }
})




// @desc    Create a stock
// @route   POST /api/stocks
// @access  Private/Admin
const createStock = asyncHandler(async (req, res) => {
 

  const stock = new Stock({
    product: req.body.product,
    color: req.body.color,
    count: req.body.count,
    size: req.body.size,
  });

  const createdStock = await stock.save();

  res.status(201).json(createdStock);
})



// @desc    Update a stock
// @route   PUT /api/stocks/:id
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const { color, count } = req.body;

  const stock = await Stock.findById(req.params.id);

  if (stock) {
    stock.color = color;
    stock.count = count;
    
    

    const updatedStock = await stock.save();
    res.json(updatedStock);
  } else {
    res.status(404);
    throw new Error('stock not found');
  }
});


export { getStocks, getStockById, getStockByProduct , deleteStock, createStock, updateStock };