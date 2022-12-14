import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Stock from '../models/stockModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const checkout = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPromoCode,
    promoCode,
    promotionOfferPrice,
    promotion,
    totalAmount,
    addressId,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else {
    // Check stock availability

    let itemsLIst = [];
    let totalAmountInDb = 0;
    for (let index = 0; index < orderItems.length; index++) {
      const isStockAvailable = await Stock.findOne({
        $and: [
          { $or: [{ product: orderItems[index].itemId }] },
          { $or: [{ _id: orderItems[index].stockId }] },
          { $or: [{ count: { $gte: orderItems[index].quantity } }] },
        ],
      });

      if (!isStockAvailable) {
        return res.status(400).json({ message: 'Stock is not available' });
      } else {
        const product = await Product.findById(orderItems[index].itemId);
        const stock = await Stock.findById(orderItems[index].stockId);

        let obj = {
          itemId: orderItems[index].itemId,
          stockId: orderItems[index].stockId,
          quantity: orderItems[index].quantity,
          totalAmount: stock.sellingPrice * orderItems[index].quantity,
          productDetails: product,
          stockDetails: stock,
        };

        itemsLIst.push(obj);

        totalAmountInDb =
          totalAmountInDb + stock.sellingPrice * orderItems[index].quantity;
      }
    }

    if (totalAmountInDb != totalPrice) {
      return res.status(400).json({ message: 'Total amount is not match' });
    }

    const order = new Order({
      orderItems: itemsLIst,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPromoCode,
      promoCode,
      promotionOfferPrice,
      promotion,
      totalAmount,
      addressId,
    });

    const createdOrder = await order.save();

    if (createdOrder) {
      let itemsLength = orderItems.length;
      for (var i = 0; i < itemsLength; i++) {
        let updateStock = await Stock.findOneAndUpdate(
          {
            product: orderItems[i].itemId,
            _id: orderItems[i].stockId,
          },
          {
            $inc: {
              count: -orderItems[i].quantity,
              totalSaleCount: orderItems[i].quantity,
            },
          },
          { new: true }
        );
      }


      // Remove items from cart
       await Cart.deleteMany({ userId: req.user._id });
    }
    return res
      .status(200)
      .json({ message: 'Order created successfully', createdOrder });

    // if (createdOrder && promotion._id != undefined) {
    //   let updatePromotionInUser = await User.findById(req.user._id);
    //   updatePromotionInUser.promotions = promotion;

    //   await updatePromotionInUser.save();

    // }

    //  res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.isPaid = true;
    order.paidAt = Date.now();

    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to shipped
// @route   GET /api/orders/:id/shipped
// @access  Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isShipped = true;
    // order.deliveredAt = Date.now()

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  let orderArray = [];
  const orders = await Order.find({ user: req.params.userId });
  for (let i = 0; i < orders.length; i++) {
    for (let j = 0; j < orders[i].orderItems.length; j++) {
      orderArray.push({
        orderId: orders[i]._id,
        data: orders[i].orderItems[j],
        createdDate: orders[i].createdAt,
        updatedDate: orders[i].updatedAt,
        totalPrice: orders[i].totalPrice,
        isShipped:orders[i].isShipped,
        isDelivered:orders[i].isDelivered,
      });
    }
  }

  res.json(orderArray);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({"_id":-1}).populate('user', 'id name');
  res.json(orders);
});

export {
  checkout,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderToShipped,
  getOrderByUserId,
};
