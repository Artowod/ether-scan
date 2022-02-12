/* ----------------- Etherium data to DB - streaming Handling ------------------ */
const axios = require("axios");
const { Block } = require("../Schemas/block-schema");
const { Transaction } = require("../Schemas/transaction-schema");

async function getTransactionByBlockNumber(params) {
  try {
    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    return data;
  } catch (error) {
    console.log("Error in getTransactionByBlockNumber: ", error);
  }
}

async function addTransactionsToDB(transactions) {
  try {
    const result = await Transaction.create(transactions);
    if (!result) throw new Error("Bad request");
    return result;
  } catch (error) {
    console.log("Error in addTransactionsToDB: ", error);
  }
}

module.exports = { getTransactionByBlockNumber, addTransactionsToDB };
