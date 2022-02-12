const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    blockHash: { type: String },
    blockNumber: { type: String },
    from: { type: String },
    gas: { type: String },
    gasPrice: { type: String },
    maxFeePerGas: { type: String },
    maxPriorityFeePerGas: { type: String },
    hash: { type: String },
    input: { type: String },
    nonce: { type: String },
    to: { type: String },
    transactionIndex: { type: String },
    value: { type: String },
    type: { type: String },
    accessList: { type: Array },
    chainId: { type: String },
    v: { type: String },
    r: { type: String },
    s: { type: String },
  },
  { versionKey: false, timestamps: true }
);

const Transaction = mongoose.model("Transactions", transactionSchema);

module.exports = { Transaction };
