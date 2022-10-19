import mongoose from 'mongoose';



const wishListSchema = mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'products',
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  }
);

const WishList = mongoose.model('WishList', wishListSchema);

export default WishList;