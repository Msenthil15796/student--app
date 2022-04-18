const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      require: true,
    },
    question: {
      type: String,
      require: true,
    },
    choices: {
      type: Array,
      require: true,
    },
    marks: {
      type: Number,
      require: true,
    },
    isApproved: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
