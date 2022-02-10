/* ----------------- Todos DB Handling ------------------ */

const Block = require("../Schemas/block-schema");
const Transaction = require("../Schemas/transaction-schema");

async function getBlock(data) {
  try {
    //    const result = await Block.find(data);
    let block = {};
    console.log("Getting Block...");
    return block;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getTransaction(data) {
  try {
    //  const result = await Transaction.find(data);
    let transaction = {};
    console.log("Getting Transaction...");
    return transaction;
  } catch (error) {
    console.log("Error: ", error);
  }
}

module.exports = { getBlock, getTransaction };
