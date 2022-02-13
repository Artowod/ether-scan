const etheriumServices = require("../services/etherium-services");
const axios = require("axios");
require("dotenv").config();
// --------------------------
// - requests to API etherscan.io - for dev mode only
// --------------------------
// getRecentBlockNumber
//+ getBlockByNumber
//+ getTransactionsByBlockNumber
//+ getTransactionByHash
// --------------------------

const getRecentBlockNumber = async (req, res, next) => {
  try {
    console.log("Getting Recent Block Number...");
    const params = {
      module: "proxy",
      action: "eth_blockNumber",
      apikey: process.env.API_KEY,
    };

    const data = await etheriumServices.getDataFromEtherium(params);
    const recentBlockNumber = data.result;
    res.json(recentBlockNumber);
  } catch (error) {
    next(error);
  }
};

const getBlockByNumber = async (req, res, next) => {
  /* Returns information about a block by block number. */
  try {
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
  } catch (err) {
    if (err.errno === -4077) console.log(`Can not get the block ${req.params.blockNumber}. Timeout exeeded. `);
    else next(err.errno);
  }
};

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

  const data = await etheriumServices.getDataFromEtherium(params);
  const isBlockExistsInDB = await etheriumServices.addBlockToDB(data.result);
  if (isBlockExistsInDB) {
    res.json(data.result.transactions);
  } else {
    etheriumServices.addBlockTransactionsToDB(data.result.transactions);
    res.json(data.result.transactions);
  }
};

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
  getRecentBlockNumber,
  getBlockByNumber,
  getTransactionsByBlockNumber,
  getTransactionByHash,
};
