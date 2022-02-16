const etheriumServices = require("../services/etherium-services");
const axios = require("axios");
require("dotenv").config();
// --------------------------
// - requests to API etherscan.io - for dev mode only
// --------------------------
//+ getRecentBlockNumber
//+ getBlockByNumber
//+ getTransactionsByBlockNumber
//+ getTransactionByHash
// --------------------------

//+

const startUpdating = async (req, res) => {
  etheriumServices.startUpdating();
  res.json({ message: "Initializing has been started.", status: "Success" });
};

const stopUpdating = async (req, res) => {
  etheriumServices.stopUpdating();
  res.json({ message: "Updaing has been stopped.", status: "Success" });
};

const getRecentBlockNumber = async (req, res, next) => {
  console.log("Getting Recent Block Number...");
  const params = {
    module: "proxy",
    action: "eth_blockNumber",
    apikey: process.env.API_KEY,
  };

  const data = await etheriumServices.getDataFromEtherium(params);
  const recentBlockNumber = data.result;
  res.json(recentBlockNumber);
};

//+
const getBlockByNumber = async (req, res, next) => {
  /* Returns information about a block by block number. */

  console.log("Getting Block by number...");
  const params = {
    module: "proxy",
    action: "eth_getBlockByNumber",
    tag: req.params.blockNumber,
    boolean: false,
    apikey: process.env.API_KEY,
  };

  const data = await etheriumServices.getDataFromEtherium(params);
  res.json(data.result);
};

//+
const getTransactionsByBlockNumber = async (req, res, next) => {
  /* Returns information about transactions of block by block number. */

  console.log("Getting Block and its transactions by Block number...");
  const params = {
    module: "proxy",
    action: "eth_getBlockByNumber",
    tag: req.params.blockNumber,
    boolean: true,
    apikey: process.env.API_KEY,
  };

  const blockByNum = await etheriumServices.getDataFromEtherium(params);
  const isBlockExistsInDB = await etheriumServices.addBlockToDB(blockByNum.result);
  if (isBlockExistsInDB) {
    res.json(blockByNum.result.transactions);
  } else {
    etheriumServices.addTransactionsToDB(blockByNum.result.transactions);
    res.json(blockByNum.result.transactions);
  }
};

//+
const getTransactionByHash = async (req, res) => {
  /* Returns the information about a transaction requested by transaction hash. */

  console.log("Getting transaction by its hash...");
  const params = {
    module: "proxy",
    action: "eth_getTransactionByHash",
    txhash: req.params.hash,
    apikey: process.env.API_KEY,
  };

  const data = await etheriumServices.getDataFromEtherium(params);
  res.json(data.result);
};

module.exports = {
  startUpdating,
  stopUpdating,
  getRecentBlockNumber,
  getBlockByNumber,
  getTransactionsByBlockNumber,
  getTransactionByHash,
};
