import mongoose from 'mongoose';

const itemsSchema = mongoose.Schema(
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'products',
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'stock',
    },
    image: { type: String },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  
    item: [itemsSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;