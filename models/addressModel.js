import mongoose from 'mongoose'
const addressSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
          },
        shippingAddress: [
            {
                firstName: { type: String, required: true },
                lastName: { type: String },
                address1: { type: String, required: true },
                address2: { type: String },
                apartment: { type: String },
                city: { type: String, required: true },
                region: { type: String,  },
                country: { type: String,  },
                zip: { type: Number, required: true },
                phone: { type: String, required: true },
            }
        ],
        billingAddress: [
            {
                firstName: { type: String, required: true },
                lastName: { type: String },
                address1: { type: String, required: true },
                address2: { type: String },
                apartment: { type: String },
                city: { type: String, required: true },
                region: { type: String,  },
                country: { type: String,  },
                zip: { type: Number, required: true },
                phone: { type: String, required: true },
            }
        ],
    }
);

const Address = mongoose.model('Address', addressSchema);

export default Address
