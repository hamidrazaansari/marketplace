const mongoose = require('mongoose')

const languageSchema = new mongoose.Schema({
    langName: {
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
  module.exports =  Language = mongoose.model('Language', languageSchema);