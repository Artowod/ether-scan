const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const blockSchema = new Schema(
  {
    jsonrpc: { type: String },
    id: { type: Number },
    result: { type: Object },
  },
  { versionKey: false, timestamps: true }
);

const Block = mongoose.model("Blocks", blockSchema);

module.exports = { Block };
