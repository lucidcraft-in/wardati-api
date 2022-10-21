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
                { $or: [{ _id: item.stockId }] },
              ],
            });
      
     
        
           if (isStockAvailable.length === 0) {
                  return res
                    .status(400)
                    .json({ message: 'Stock is not available', code: 400 });
           } else {
               
             const isCartAdded = await Cart.find({ userId: userId });
             
            
             if (isCartAdded.length != 0) {
                 
            
               const findItem  = isCartAdded[0].item.find(
                 (itm) => itm.itemId.toString() === item.itemId
               );

         
       
               if (!findItem) {
                 
                 let obj = {
                   itemName: item.itemName,
                   quantity: item.quantity,
                   itemId: item.itemId,
                   stockId: item.stockId,
                 };

                 isCartAdded[0].item.push(obj);

                 await isCartAdded[0].save();
                 return res
                   .status(200)
                   .json({
                     message: 'Cart item added',
                     isCartAdded,
                     code: 200,
                   });
               } else {
              

                    const findItemIndex = isCartAdded[0].item.findIndex(
                      (itm) => itm.itemId.toString() === item.itemId
                    );
   

                 isCartAdded[0].item[findItemIndex].quantity = item.quantity;
                 isCartAdded[0].item[findItemIndex].stockId = item.stockId;
                 
                 
                 await isCartAdded[0].save();
                 return res
                   .status(200)
                   .json({
                     message: 'Cart item quantity updated',
                     isCartAdded,
                     code :200
                   });
               }
             } else {
              
               const addToCart = new Cart({
                 userId: req.body.userId,
                 item: req.body.item,
               });
               const cartCreated = await addToCart.save();

               return res
                 .status(200)
                 .json({ message: 'New cart created', cartCreated, code: 200 });
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
         const stock = await Stock.findById(cart.item[index].stockId);
         
       

         cart.item[index].image = productDetails.images[0].url;
         cart.item[index].price = stock.price;
         cart.item[index].sellingPrice = stock.sellingPrice;
       }
 
      //  await cart.save();

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
    const cart = await Cart.findById(req.body.id);
     
    let cartItem = cart.item.findIndex((ite) => ite.itemId.toString() === req.body.itemId);
   

    if (cartItem >= 0) { cart.item.splice(cartItem, 1); } else {
       return res.status(400).json({ message: "Item not found in cart" });
    }

      await cart.save();
    
     return res.status(200).json({ message: 'Item removed', cart });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
  
});
export { addCart, getCartByUser, removeOnCart };