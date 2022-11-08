import asyncHandler from 'express-async-handler';
import Address from '../models/addressModel.js';


const createAddress = asyncHandler(async (req, res) => {
    const {
        shippingAddress,
        billingAddress,
      
      } = req.body;
    const address = new Address({
        shippingAddress: shippingAddress,
        billingAddress:billingAddress,
        user: req.body.user,
    });
    const createdAddress = await address.save();

    res.status(201).json(createdAddress);
});

const getAddressByUser = asyncHandler(async (req, res) => {
    try {
        const address = await Address.findOne({ userId: req.params.id });
        return res.status(200).json(address);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
})
const updateAddress = asyncHandler(async (req, res) => {
    const {
        shippingAddress,
        billingAddress,
      
    } = req.body;
    
    const address = await Address.findById(req.params.id);
    if (address) {
        address.shippingAddress = shippingAddress;
        address.billingAddress = billingAddress;
        const updateAddress = await address.save();
        res.json(address);
    }
    else {
        res.status(404);
        throw new Error('addres not found');
    }
})

const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    if (address) {
        await address.remove();
        res.json({ message: 'Address removed' });
    }
    else {
        res.status(404);
    throw new Error('Address not found');
    }
})

export {
    createAddress,
    getAddressByUser,
    updateAddress,
    deleteAddress,
}