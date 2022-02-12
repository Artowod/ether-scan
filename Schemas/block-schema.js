const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const blockSchema = new Schema(
  {
    hash: { type: String },
    number: { type: String },
    size: { type: String },
    transactionsCount: { type: Number },
  },
  { versionKey: false, timestamps: true }
);

const Block = mongoose.model("Blocks", blockSchema);

module.exports = { Block };
