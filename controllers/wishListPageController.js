import asyncHandler from 'express-async-handler';
import WishList from '../models/wishListModel.js';
 

const addWishList = asyncHandler(async (req, res) => {

const isWishlistAdded = await WishList.find({ itemId: req.body.itemId });
 
   
    if (isWishlistAdded.length >0) {
      return res.status(200).json({ message: 'item already added' });
    } else {
      const wishList = new WishList({
        userId: req.body.userId,
        itemId: req.body.itemId,
      });
    
      const createdWishList = await wishList.save();
      // console.log("dhdsdhdhdhddhdhhd");
      // console.log(createdWishList);
      // return res.status(200).json(createdWishList);
      return res
                 .status(200)
                 .json({ message: 'Wish List added', createdWishList, code: 200 });
    }

});


const removeWishList = asyncHandler(async (req, res) => {
 
  const wishList = await WishList.findById(req.params.id);

  if (wishList) {
    await wishList.remove();
    res.json({ message: 'Wishlist  removed' });
  } else {
    res.status(404);
    throw new Error('Wishlist not found');
  }
});

const getWishListByUser = asyncHandler(async (req, res) => {
  

  const wishList = await WishList.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'itemId',
        foreignField: '_id',
        as: 'items',
      },
    },
     
  ]);


  const byUser = wishList.map(
    (list) => {

      if (list.userId.toString() === req.params.id) {
        return list;
      }
    }
      
  );
  

  if (byUser) {
    res.json(byUser);
  } else {
    res.status(404);
    throw new Error('wishList not found');
  }
});

const getWishListByProduct = asyncHandler(async (req, res) => {
  const wishList = await WishList.findOne({
    itemId: req.params.id,
    userId: req.params.user,
  });

  if (wishList) {
    res.json(wishList);
  } else {
    res.status(404);
    throw new Error('wishList not found');
  }
});



export { addWishList, removeWishList, getWishListByUser, getWishListByProduct };