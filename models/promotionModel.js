import mongoose from 'mongoose';



const promotionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;