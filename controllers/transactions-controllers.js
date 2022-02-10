const transactionsServices = require("../services/transactions-services");

// --------------------------
// - Input поиска транзакции
// --------------------------
// по адресу получателя,
// по адресу отправителя,
// по id транзакции,
// по номеру блока,
// --------------------------

const getTransactionsByRecipientAddr = (req, res) => {
  const data = {};
  res.json({ message: "Transactions By Recipient Address", status: "Success", data });
};

const getTransactionsBySenderAddr = (req, res) => {
  const data = {};
  res.json({ message: "Transactions By Sender Address", status: "Success", data });
};

const getTransactionById = (req, res) => {
  const data = {};
  res.json({ message: "Transactions By ID", status: "Success", data });
};

const getTransactionsByBlockNum = (req, res) => {
  const data = {};
  res.json({ message: "Transactions By Block Number", status: "Success", data });
};

module.exports = {
  getTransactionsByRecipientAddr,
  getTransactionsBySenderAddr,
  getTransactionById,
  getTransactionsByBlockNum,
};
