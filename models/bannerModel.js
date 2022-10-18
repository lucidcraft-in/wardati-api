import mongoose from 'mongoose';

 

const bannerSchema = mongoose.Schema(
  {
    
    bannerPosition: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required :true
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;