import mongoose from 'mongoose';

const stockSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    count: { type: Number, required: true },
    totalSaleCount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;
