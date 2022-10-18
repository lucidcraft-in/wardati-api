import asyncHandler from 'express-async-handler';
import Banner from '../models/bannerModel.js';


const addBanner = asyncHandler(async (req, res) => {
  const banner = new Banner({
    bannerPosition: req.body.bannerPosition,
    image: req.body.image,
  });
  const createdBanner = await banner.save();
  res.status(200).json(createdBanner);
});

const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({});
  res.json({ banners });
});


const getBanner = asyncHandler(async (req, res) => {
  
  const banner = await Banner.find({
    bannerPosition: req.params.id,
  });
 res.json({ banner });
});

const deleteBanner = asyncHandler(async (req, res) => {
  

  const banner = await Banner.findById(req.params.id);

  if (banner) {
    await banner.remove();
    res.json({ message: 'Banner removed' });
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});
export { addBanner, getBanner, deleteBanner, getBanners };

