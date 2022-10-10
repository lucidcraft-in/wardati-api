import mongoose from 'mongoose'

const subCategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  tittle: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;