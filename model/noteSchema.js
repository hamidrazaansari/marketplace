const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    activeindicator: {
        type: String,
      },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =  Note = mongoose.model('Note', NoteSchema);
