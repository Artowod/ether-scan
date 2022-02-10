const Joi = require("joi");

// ==============================
// getTransactionsByRecipientAddr,
// getTransactionsBySenderAddr,
// getTransactionById,
// getTransactionsByBlockNum,
// ==============================

//example:  "to":"0xc67f4e626ee4d3f272c2fb31bad60761ab55ed9f",
const joiTransByRecipientSchema = Joi.object({
  to: Joi.string()
    .regex(/^0x[a-z0-9]*$/)
    .length(42)
    .required(),
});

//example:  "from":"0x00192fb10df37c9fb26829eb2cc623cd1bf599e8",
const joiTransBySenderSchema = Joi.object({
  from: Joi.string()
    .regex(/^0x[a-z0-9]*$/)
    .length(42)
    .required(),
});

const joiTransByIdSchema = Joi.object({
  id: Joi.number().required(),
});

//example: 0xC36B3C
const joiTransByBlockIdSchema = Joi.object({
  tag: Joi.string()
    .regex(/^0x[a-fA-F0-9]*$/)
    .required(),
});

module.exports = { joiTransByRecipientSchema, joiTransBySenderSchema, joiTransByIdSchema, joiTransByBlockIdSchema };
