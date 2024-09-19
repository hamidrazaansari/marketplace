const mongoose  = require("mongoose");

// MongoDB Schema and Mode
const DataSchema = new mongoose.Schema({
    price: Number,
    website: String,
    da: Number,
    pa: Number,
    spamScore: Number,
    dr: Number,
    ahrefTraffic: Number,
    SEMRushTraffic: Number,
    type: String,
    niche: String,
    language: String,
    category: String,
    country: String,
  });
  
  module.exports = DataModel = mongoose.model('DataModel', DataSchema);