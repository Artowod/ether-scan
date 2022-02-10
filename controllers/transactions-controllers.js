const transactionsServices = require("../services/transactions-services");

const getAll = (req, res) => {
  res.json({ message: " All transactions" });
};

const getBlockByNumber = (req, res) => {
  transactionsServices.getBlock();
  res.json({ message: ` Block by number ${req.params.blockNumber}` });
};

const getTransactionByHash = (req, res) => {
  transactionsServices.getTransaction();
  res.json({ message: `Transaction By Hash <${req.params.transactionHash}>` });
};

module.exports = { getAll, getBlockByNumber, getTransactionByHash };
