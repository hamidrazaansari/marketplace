const mongoose = require('mongoose');

const nicheSchema = new mongoose.Schema({
    nicheName: {
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
  module.exports =  Niche = mongoose.model('Niche', nicheSchema);