const transactionsServices = require("../services/transactions-services");

// --------------------------
// - Input поиска транзакции
// --------------------------
//+ по адресу получателя,
//+ по адресу отправителя,
//+ по id транзакции,
//+ по номеру блока,
// --------------------------

const getTransactionsByRecipientAddr = async (req, res) => {
  const result = await transactionsServices.getTransactionsByRecipientAddr(req.params.addr);
  res.json({ message: "Transactions By Recipient Address", status: "Success", result });
};

const getTransactionsBySenderAddr = async (req, res) => {
  const result = await transactionsServices.getTransactionsBySenderAddr(req.params.addr);
  res.json({ message: "Transactions By Sender Address", status: "Success", result });
};

const getTransactionById = async (req, res) => {
  const result = await transactionsServices.getTransactionById(req.params.transactionId);
  res.json({ message: "Transactions By ID", status: "Success", result });
};

const getTransactionsByBlockNum = async (req, res) => {
  const result = await transactionsServices.getBlockTransactions(req.params.blockNumber);
  res.json({ message: "Transactions By Block Number", status: "Success", result });
};

module.exports = {
  getTransactionsByRecipientAddr,
  getTransactionsBySenderAddr,
  getTransactionById,
  getTransactionsByBlockNum,
};
