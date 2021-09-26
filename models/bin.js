const mongoose = require("mongoose")

const binSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request'}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bin", binSchema);