
const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  text: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  mood: {
    type: String,
    default: "😊"
  },

  image: {
    type: String,
    default: ""
  },

  isFavorite: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Memory", memorySchema);
