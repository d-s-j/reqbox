const mongoose = require("mongoose");

const rawRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    raw_request: String,
    request_id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RawRequest", rawRequestSchema);