import mongoose from 'mongoose'

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        itemId: { type: String, required: true },
        stockId: { type: String, required: true },
        quantity: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        productDetails: {},
        stockDetails: {  },
  
      },
    ],
    promotion: {},
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String },
      address1: { type: String, required: true },
      address2: { type: String },
      apartment: { type: String },
      city: { type: String, required: true },
      region: { type: String, required: true },
      country: { type: String, required: true },
      zip: { type: Number, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: Number,
      required: true,
    },
    // 1. COD
    // 2. CARD
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPromoCode: {
      type: Boolean,
      required: true,
      default: false,
    },
    promoCode: {
      type: String,
    },
    promotionOfferPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isShipped: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema)

export default Order
