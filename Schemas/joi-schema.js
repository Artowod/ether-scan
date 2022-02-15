const Joi = require("joi");

// ==============================
// getTransactionsByRecipientAddr,
// getTransactionsBySenderAddr,
// getTransactionById,
// getTransactionsByBlockNum,
// ==============================

//example:  "to":"0xc67f4e626ee4d3f272c2fb31bad60761ab55ed9f",
const joiTransByRecipientSchema = Joi.string()
  .regex(/^0x[a-fA-F0-9]*$/)
  .length(42)
  .required();

//example:  "from":"0x00192fb10df37c9fb26829eb2cc623cd1bf599e8",
const joiTransBySenderSchema = Joi.string()
  .regex(/^0x[a-fA-F0-9]*$/)
  .length(42)
  .required();

//example: "hash": 0x632e3a7c7079eeda271a58be9479d0a5cfdde1aa0801031e9789f180fd4d7c13;
const joiTransByIdSchema = Joi.string()
  .regex(/^0x[a-fA-F0-9]*$/)
  .length(66)
  .required();

//example: "blockNumber":"0xcf2420"
const joiTransByBlockIdSchema = Joi.string()
  .regex(/^0x[a-fA-F0-9]*$/)
  .required();

module.exports = { joiTransByRecipientSchema, joiTransBySenderSchema, joiTransByIdSchema, joiTransByBlockIdSchema };
