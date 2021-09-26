const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    body: String,
    headers: Object,
    method: String,
    bin: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);