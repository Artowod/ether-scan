/* ----------------- Transactions DB Handling ------------------ */

const { Block } = require("../Schemas/block-schema");
const { Transaction } = require("../Schemas/transaction-schema");

async function getBlockTransactions(data) {
  try {
    const block = await Block.findOne({ number: data });
    console.log("Getting Block...");
    if (block) {
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
    console.log("Getting Transaction By Id...");
    const transaction = await Transaction.findOne({ hash: data });
    return transaction;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getTransactionsByRecipientAddr(data) {
  try {
    console.log("Getting Transactions By Recipient Addr...");
    const transaction = await Transaction.find({ to: data });

    return transaction;
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function getTransactionsBySenderAddr(data) {
  try {
    console.log("Getting Transaction By Sender Addr...");
    const transaction = await Transaction.find({ from: data });
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
