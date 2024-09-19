const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    countryName: {
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
  module.exports =  Country = mongoose.model('Country', countrySchema);