const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const blockSchema = new Schema(
  {
    hash: { type: String },
    number: { type: String },
    size: { type: String },
    timestamp: { type: String },
    baseFeePerGas: { type: String },
    confirmations: { type: String },
    transactionsCount: { type: Number },
  },
  { versionKey: false, timestamps: true }
);

const Block = mongoose.model("blocks", blockSchema);

module.exports = { Block };
