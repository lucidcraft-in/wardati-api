import asyncHandler from 'express-async-handler';
import Banner from '../models/bannerModel.js';


const addBanner = asyncHandler(async (req, res) => {
  const banner = new Banner({
    bannerPosition: req.body.bannerPosition,
    image: req.body.image,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
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

const getSingleBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
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

const updateBanner = asyncHandler(async (req, res) => {
  const { bannerPosition, image, title, description, category } = req.body;

  const banner = await Banner.findById(req.params.id);

  if (banner) {
    banner.bannerPosition = bannerPosition;
    banner.image = image;
    banner.title = title;
    banner.description = description;
    banner.category = category;
    const updateBanner = await banner.save();
    res.json(updateBanner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});
export {
  addBanner,
  getBanner,
  deleteBanner,
  getBanners,
  getSingleBanner,
  updateBanner,
};

