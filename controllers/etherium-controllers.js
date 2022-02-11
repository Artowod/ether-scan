const etheriumServices = require("../services/etherium-services");
const axios = require("axios");
require("dotenv").config();
// --------------------------
// - requests to API etherscan.io - for dev mode only
// --------------------------
// getRecentBlockNumber
// CESCheck
// getBlockByNumber
// getTransactionsByBlockNumber
// getTransactionByHash
// --------------------------

const getRecentBlockNumber = async (req, res, next) => {
  try {
    console.log("Getting Recent Block Number...");
    const params = {
      module: "proxy",
      action: "eth_blockNumber",
      apikey: process.env.API_KEY,
    };

    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    const recentBlockNumber = data.result;
    res.json(recentBlockNumber);
  } catch (error) {
    next(error);
  }
};

const CESCheck = (req, res) => {
  const data = {};
  res.json(data);
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

    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });

    res.json(data);
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
  const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
  res.json(data.result.transactions);
};

const getTransactionByHash = (req, res) => {
  const data = {};
  res.json(data);
};
module.exports = {
  getRecentBlockNumber,
  CESCheck,
  getBlockByNumber,
  getTransactionsByBlockNumber,
  getTransactionByHash,
};
