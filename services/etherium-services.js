/* ----------------- Etherium data to DB - streaming Handling ------------------ */
const axios = require("axios");
const { Block } = require("../Schemas/block-schema");
const { Transaction } = require("../Schemas/transaction-schema");

async function getDataFromEtherium(params) {
  try {
    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    return data;
  } catch (error) {
    console.log("Error in getDataFromEtherium: ", error);
  }
}

async function addBlockTransactionsToDB(transactions) {
  try {
    const result = await Transaction.create(transactions);
    if (!result) throw new Error("Bad request");
  } catch (error) {
    console.log("Error in addTransactionsToDB: ", error);
  }
}

async function addBlockToDB({ hash, number, size, transactions }) {
  console.log(hash, number, size, transactions);
  try {
    const minimizedBlock = {
      hash,
      number,
      size,
      transactionsCount: transactions.length,
    };

    if (await Block.findOne({ number })) {
      console.log("Such Block already exists in DB");
      return true;
    }
    const result = await Block.create(minimizedBlock);
    if (!result) throw new Error("Bad request");
  } catch (error) {
    console.log("Error in addBlockToDB: ", error);
  }
}

module.exports = { getDataFromEtherium, addBlockTransactionsToDB, addBlockToDB };
