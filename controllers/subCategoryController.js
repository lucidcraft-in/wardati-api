import asyncHandler from 'express-async-handler';
import SubCategory from '../models/subcategoryModel.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';

// @desc    Fetch all subCategory
// @route   GET /api/subCategory
// @access  Public
const getSubCategory = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  
  

  const count = await SubCategory.countDocuments();
  const subCategories = await SubCategory.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category_',
      },
    },
  ])
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ subCategories, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single subCategory
// @route   GET /api/subCategories/:id
// @access  Public
const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  
;
  if (subCategory) {
    res.json( subCategory );
  } else {
    res.status(404);
    throw new Error('subCategory not found');
  }
});

// @desc    Delete a subCategory
// @route   DELETE /api/subCategorys/:id
// @access  Private/Admin
const deleteSubCategory = asyncHandler(async (req, res) => {


  const isProductListed = await Product.find({ subcategory: req.params.id });

  if (isProductListed.length > 0) {
    throw new Error('Product listed on this category');

    return;
  }


  const subCategory = await SubCategory.findById(req.params.id);

  if (subCategory) {
    await subCategory.remove();
    res.json({ message: 'subCategory removed' });
  } else {
    res.status(404);
    throw new Error('subCategory not found');
  }
});

// @desc    Create a subCategory
// @route   POST /api/subCategory
// @access  Private/Admin
const createSubCategory = asyncHandler(async (req, res) => {
  

  const subCategory = new SubCategory({
    name: req.body.name,
    category: req.body.category,
    tittle: req.body.tittle,
  });

  const createdSubCategory = await subCategory.save();

  res.status(201).json(createdSubCategory);
});

// @desc    Update a subCategory
// @route   PUT /api/subCategory/:id
// @access  Private/Admin
const updateSubCategory = asyncHandler(async (req, res) => {
  const { name, tittle, category } = req.body;

  const subCategory = await SubCategory.findById(req.params.id);

  if (subCategory) {
    subCategory.name = name;
    subCategory.tittle = tittle;
    subCategory.category = category;

    const updatedSubCategory = await subCategory.save();
    res.json(updatedSubCategory);
  } else {
    res.status(404);
    throw new Error('subCategory not found');
  }
});

 

export {
  getSubCategory,
  getSubCategoryById,
  deleteSubCategory,
  createSubCategory,
  updateSubCategory,
   
};
