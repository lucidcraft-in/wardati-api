import asyncHandler from 'express-async-handler';
import Promotion from '../models/promotionModel.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';


// @desc    Fetch all promotion
// @route   GET /api/promotion
// @access  Public
const getPromotion = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
        
      }
    : {};

  const count = await Promotion.countDocuments({ ...keyword });
  const promotions = await Promotion.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ promotions, page, pages: Math.ceil(count / pageSize) });
})



// @desc    Fetch single promotion
// @route   GET /api/promotions/:id
// @access  Public
const getPromotionById = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  let orders = await Order.find({ "promotion._id": req.params.id
});

  if (promotion) {
    res.json({ promotion, orders });
  } else {
    res.status(404)
    throw new Error('Promotion not found')
  }
})






// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
const deletePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id)

  if (promotion) {
    await promotion.remove()
    res.json({ message: 'promotion removed' })
  } else {
    res.status(404)
    throw new Error('promotion not found')
  }
})





// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = asyncHandler(async (req, res) => {
 

  const isDuplicateCode = await Promotion.findOne({ code: req.body.promoCode });

  

  if (isDuplicateCode) {
      res.status(400);
      throw new Error('Promo code is already using');
  }

    

  const promotion = new Promotion({
    name: req.body.name,
    phone: req.body.phone,
    code: req.body.promoCode,
    isActive: req.body.status,
  });

  const createdPromotion = await promotion.save();

  res.status(201).json(createdPromotion)
})



// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
const updatePromotion = asyncHandler(async (req, res) => {
  const { name, phone, promoCode, status } = req.body;

  const promotion = await Promotion.findById(req.params.id)
 

  if (promotion) {
    promotion.name = name
    promotion.phone = phone;
   promotion.code = promoCode;
     promotion.isActive = status;

    const updatedPromotion = await promotion.save();
    res.json(updatedPromotion)
  } else {
    res.status(404)
    throw new Error('Promotion not found')
  }
})



// @desc    Check promo code
// @route   PUT /api/promotion/:code
// @access  Private/Admin
const validatePromoCode = asyncHandler(async (req, res) => {
  
 
  const promotion = await Promotion.findOne({ code: req.params.code });

  if (promotion) {
  
    
    return res.status(200).send({
      availability: false,
    });
  } else {
      return res.status(200).send({
        availability: true,
      });
  }
});


// @desc    Check promo code
// @route   PUT /api/promotion/:code
// @access  Private/Admin
const validatePromoCodeOnApply = asyncHandler(async (req, res) => {
  
 
  const promotion = await Promotion.findOne({ code: req.params.code , isActive : true});

  if (!promotion) {
    return res.status(200).send({
      availability: false, message : "Please enter valid promo code"
    });
  } else {

    let userData = await User.findById(req.user._id);
    
   
     if (
       userData.promotions &&
       userData.promotions.filter((e) => e.code === req.params.code).length > 0
     ) {
       return res.status(200).send({
           availability: false,
         message: 'promo code is not valid',
       });
     }
       return res.status(200).send({
         availability: true,
         message: 'Promo code is valid',
         data: promotion,
       });
  }
});

export {
  getPromotion,
  getPromotionById,
  deletePromotion,
  createPromotion,
  updatePromotion,
  validatePromoCode,
  validatePromoCodeOnApply,
};