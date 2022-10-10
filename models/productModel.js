import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)
const imagesSchema = mongoose.Schema(
  {
    color: { type: String, required: true },
    url: { type: String, required: true },
  
   
  },
  {
    timestamps: true,
  }
);

const productStock = mongoose.Schema(
  {
    size: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    // image: {
    //   type: String,
    //   required: true,
    // },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'category',
    },
    subcategory: {
      type: String,
      required: true,
      default: '',
    },

    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: [productStock],
    promotionPercentage: {
      type: Number,
      default: 0,
    },
    images: [imagesSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema)

export default Product
