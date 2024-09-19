const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName: {
      type: String,
      required: true,
    },
    activeindicator: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  });
  
  // Create Model
  module.exports =  Category = mongoose.model('Category', categorySchema);