const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
