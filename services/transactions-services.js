/* ----------------- Transactions DB Handling ------------------ */

const { Block } = require("../Schemas/block-schema");
const { Transaction } = require("../Schemas/transaction-schema");

async function getBlockTransactions(data) {
  try {
    // console.log("Data", data);
    const block = await Block.findOne({ number: data });
    console.log("Getting Block...");
    // let transaction;
    if (block) {
      console.log("such block exists in DB", block);
      const transactions = await Transaction.find({ blockNumber: data });
      console.log("Transactions-count", transactions.length);
      return transactions;
    } else {
      console.log("Block is missing in DB");
      return [];
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getTransactionById(data) {
  try {
    const transaction = await Transaction.findOne({ hash: data });
    // let transaction = {};
    console.log("Getting Transaction...");
    return transaction;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getTransactionsByRecipientAddr(data) {
  try {
    const transaction = await Transaction.find({ to: data });
    // let transaction = {};
    console.log("Getting Transaction...");
    return transaction;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getTransactionsBySenderAddr(data) {
  try {
    const transaction = await Transaction.find({ from: data });
    // let transaction = {};
    console.log("Getting Transaction...");
    return transaction;
  } catch (error) {
    console.log("Error: ", error);
  }
}

module.exports = {
  getBlockTransactions,
  getTransactionById,
  getTransactionsByRecipientAddr,
  getTransactionsBySenderAddr,
};
