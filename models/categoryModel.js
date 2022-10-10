import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        categoryName : { type: String, required: true },
        title: { type: String },
        priority:{  type: Number,}
    }
)

const Category = mongoose.model('Category', categorySchema);
export default Category;