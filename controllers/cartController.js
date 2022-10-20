import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import Stock from '../models/stockModel.js';
 
const addCart = asyncHandler(async (req, res) => {
    try {

        const { userId, item } = req.body;

            const isStockAvailable = await Stock.find({
                $and: [
                { $or: [{ product: item.itemId }] },
                { $or: [{ count: { $gte: item.quantity } }] },
                ],
            });
        
           if (isStockAvailable.length === 0) {
                  return res
                    .status(400)
                    .json({ message: 'Stock is not available' });
           } else {
               
               const isCartAdded = await Cart.findOne({ userId: userId });
               
                 if (isCartAdded.length === 0) {
                   const addToCart = new Cart({
                     userId: req.body.userId,
                     item: req.body.item,
                   });
                   const cartCreated = await addToCart.save();

                   return res.status(200).json(cartCreated);
                 } else {
                     
                     const findItemIndex = isCartAdded.item.findIndex(
                       (itm) => itm.itemId.toString() === item.itemId
                     );

                   

                       
                     if (findItemIndex < 0) {
                       
                         let obj = {
                           itemName: item.itemName,
                           quantity: item.quantity,
                           itemId: item.itemId,
                         };
                       isCartAdded.item.push(obj)
                     } else {
                          
                         isCartAdded.item[findItemIndex].quantity =
                           item.quantity;
                     }
 
                  
                     const updateCategory = await isCartAdded.save();
                      return res
                        .status(200)
                        .json({ message: 'Cart already added'});
                   
                  
                 }
            }

         
    } catch (error) {
       return res.status(500).json({ message: error });
    }

});


const getCartByUser = asyncHandler(async (req, res) => {

  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    if (cart) {
       for (let index = 0; index < cart.item.length; index++) {
         const productDetails = await Product.findById(cart.item[index].itemId);

         cart.item[index].image = productDetails.images[0].url;
       }

       await cart.save();

       return res.status(200).json(cart);
    } else {
      return res.status(400).json({ message: "No items added on cart" });
    }
     
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  
  
   
});




const removeOnCart = asyncHandler(async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  
});
export { addCart, getCartByUser, removeOnCart };