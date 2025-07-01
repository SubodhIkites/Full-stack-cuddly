const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      trim: true,
      unique: true,
      minlength: [2, 'Category name must be at least 2 characters long'],
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    image: {
      type: String,
      required: [true, 'Please provide category image']
    },
    description: {
      type: String,
      trim: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;