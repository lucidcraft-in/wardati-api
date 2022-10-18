import mongoose from 'mongoose';

 

const bannerSchema = mongoose.Schema(
  {
    bannerPosition: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    title: { type: String },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'category',
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;