import asyncHandler from "express-async-handler";
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import SubCategory from '../models/subcategoryModel.js';


const addCategory = asyncHandler(async (req, res) => {
   
    const category = new Category({
        categoryName: req.body.categoryName,
        title: req.body.title,
        priority: req.body.priority,
    })
    const createdCategory = await category.save()
    res.status(200).json(createdCategory);
})

const updateCategory = asyncHandler(async (req, res) => {
    const {
        categoryName,
        title,
        priority
    } = req.body;

    const category = await Category.findById(req.params.id)

    if (category) {
        category.categoryName = categoryName;
        category.title = title;
        category.priority = priority;

        const updateCategory = await category.save()
        res.json(updateCategory);
    }
    else {
        res.status(404)
        throw new Error('Category not found')
    }
})

const getCategories = asyncHandler(async (req, res) => {

    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
  
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}
  
    const count = await Category.countDocuments({ ...keyword })
    const categories = await Category.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
  
    res.json({ categories, page, pages: Math.ceil(count / pageSize) })
})


const getHomeCategories = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const category = await Category.findById(req.body.category);
  const categoryName = category.categoryName
  
  const list = await SubCategory.find({ category: req.body.category });

  let subCategory = []
  for (let i = 0; i < list.length; i++) {
     console.log(list[i]._id);
    let count = await Product.countDocuments({ subcategory: list[i]._id });

   
    let obj = {
      name: list[i].name,
      _id: list[i]._id,
      count: count,
    };
    subCategory.push(obj);
  }

 

  let query;
  if (req.body.subcategory) {
     query = {
     category: req.body.category,
     subcategory: req.body.subcategory,
   };

  } else {
        query = {
        category: req.body.category,
      };
  }

 
  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    subCategory,
    categoryName, page,
    pages: Math.ceil(count / pageSize),
  });
});



const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)
  
    if (category) {
      res.json(category)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
})
  
const deleteCategory = asyncHandler(async (req, res) => {

  const isProductListed = await Product.find({ category: req.params.id });

  if (isProductListed.length > 0) {
     throw new Error('Product listed on this category');
   
    return;
  }

    const category = await Category.findById(req.params.id)
  
    if (category) {
      await category.remove()
      res.json({ message: 'Category removed' })
    } else {
      res.status(404)
      throw new Error('Category not found')
    }
  })

export {
  addCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  getHomeCategories,
};

