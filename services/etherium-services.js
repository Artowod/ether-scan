/* ----------------- Etherium data to DB - streaming Handling ------------------ */
const axios = require("axios");
const { Block } = require("../Schemas/block-schema");
const { Transaction } = require("../Schemas/transaction-schema");

//+ needs for controllers
async function getDataFromEtherium(params) {
  try {
    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    return data;
  } catch (err) {
    console.log("Error in getDataFromEtherium: ", err.errno);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
    else next(err.errno);
  }
}

//+ needs for controllers
async function addBlockTransactionsToDB(transactions) {
  try {
    const result = await Transaction.create(transactions);
    if (!result) throw new Error("Bad request");
  } catch (err) {
    console.log("Error in addTransactionsToDB: ", error.errno);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
    else next(err.errno);
  }
}

//+ needs for controllers
async function addBlockToDB({ hash, number, size, timestamp, baseFeePerGas, transactions }) {
  try {
    if (await Block.findOne({ number })) {
      console.log("Such Block already exists in DB");
      return true;
    }

    const minimizedBlock = {
      hash,
      number,
      size,
      timestamp,
      baseFeePerGas,
      transactionsCount: transactions.length,
    };
    console.log("block ", minimizedBlock);
    const result = await Block.create(minimizedBlock);
    if (!result) throw new Error("Bad request");
  } catch (err) {
    console.log("Error in addBlockToDB: ", err.errno);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
    else next(err.errno);
  }
}

// needs for etheriumCheckInLoop function (transactions update and store to DB)
async function getConfirmationsCount(currentBlockNum) {
  console.log("Counting how many blocks appeared after current block...");
  const params = {
    module: "proxy",
    action: "eth_blockNumber",
    apikey: process.env.API_KEY,
  };
  const recentBlock = await getDataFromEtherium(params);
  console.log("RB:", recentBlock);
  const result = recentBlock.result.toString(10) - currentBlockNum.toString(10);
  console.log(`${result} blocks were mined after that.`);
  return result;
}

async function getRecentBlockNumber() {
  /* Returns the number of most recent block */
  try {
    console.log("Getting Recent Block Number...");
    const params = {
      module: "proxy",
      action: "eth_blockNumber",
      apikey: process.env.API_KEY,
    };

    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    const recentBlockNumber = data.result;
    return recentBlockNumber;
  } catch (err) {
    console.log("Error in getRecentBlockNumber: ", err);
  }
  //   axios
  //     .get(`https://api.etherscan.io/api`, { params })
  //     .then(({ data }) => {
  //       console.log(data.result);
  //       getBlockByNumber(data.result);

  //     })
  //     .catch((error) => console.log("Error: ", error));
}

async function getFirstBlocks(number) {
  let recentBlockNumber = await getRecentBlockNumber();
  try {
    for (let i = 0; i < number; i += 1) {
      console.log("Block num: ", recentBlockNumber);
      const transactionsLength = await getBlockByNumber(recentBlockNumber.toString(16));
      console.log("Length: ", transactionsLength);
      recentBlockNumber -= 1;
    }
  } catch (err) {
    console.log("Error in : getFirstBlocks", err);
  }
}

async function getBlockByNumber(blockNumber) {
  /* Returns information about a block by block number. */
  try {
    console.log("Getting Block by number...");
    const params = {
      module: "proxy",
      action: "eth_getBlockByNumber",
      tag: blockNumber,
      boolean: false,
      apikey: process.env.API_KEY,
    };

    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });

    console.log("--------------------------------------");
    console.log(`Block num: ${blockNumber}`);
    console.log("--------------------------------------");
    console.log(data.result);
    return data.result;
  } catch (err) {
    if (err.errno === -4077) console.log(`Can not get the block ${blockNumber}. Timeout exeeded. `);
    else console.log("Error in : getBlockByNumber. Error number is ", err.errno);
  }
}

function getTransactionsByBlockNumber(blockNumber) {
  /* Returns information about transactions of block by block number. */

  console.log("Getting Block and its transactions by number...");
  const params = {
    module: "proxy",
    action: "eth_getBlockByNumber",
    tag: blockNumber,
    boolean: true,
    apikey: process.env.API_KEY,
  };
  axios
    .get(`https://api.etherscan.io/api`, { params })
    .then(({ data }) => {
      console.log("Block transactions: ", data.result.transactions);
    })
    .catch((error) => console.log("Error: ", error));
}

function getTransactionByHash(hash) {
  /* Returns the information about a transaction requested by transaction hash. */

  console.log("Contract status check...");
  const params = {
    module: "proxy",
    action: "eth_getTransactionByHash",
    txhash: `0x${hash}`,
    apikey: process.env.API_KEY,
  };
  axios
    .get(`https://api.etherscan.io/api`, { params })
    .then(({ data }) => {
      console.log("GetTransaction result: ", data);
      return { success };
    })
    .catch((error) => console.log("Error: ", error));
}

const updateAllExistingTransactions = async (recentBlock) => {
  try {
    const allData = await Transaction.find();
    //  Transaction.updateMany({}, { $set: { confirmations: (transaction.blockNumber - recentBlockNum).toString(10) } });
    const { number: recentBlockNum } = recentBlock;
    // const result = allData.map((transaction) => ({
    //   ...transaction,
    //   confirmations: (transaction.blockNumber - recentBlockNum).toString(10),
    // }));

    allData.forEach(({ hash, blockNumber }) => {
      Transaction.findOneAndUpdate({ hash }, { confirmations: (recentBlockNum - blockNumber).toString(10) });
    });
  } catch (err) {
    console.log("Error in updateAllExistingTransactions: ", err.errno);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
    else next(err.errno);
  }
  /* 
 =====cool example==========
Promise.allSettled(urls.map((url) => fetch(url))).then((results) => {
  // (*)
  results.forEach((result, num) => {
    if (result.status == "fulfilled") {
      alert(`${urls[num]}: ${result.value.status}`);
    }
    if (result.status == "rejected") {
      alert(`${urls[num]}: ${result.reason}`);
    }
  });
}); 

*/

  // const result = async allData.map(({ hash, blockNumber }) => {
  //   await Transaction.findOneAndUpdate({ hash }, { confirmations: (recentBlockNum - blockNumber).toString(10) });
  // });
};

const addFieldsToTransaction = async (recentBlock) => {
  const allData = await Transaction.find();
  const { number = recentBlockNum, timestamp, baseFeePerGas } = recentBlock;
  allData.map((transaction) => ({
    ...transaction,
    confirmations: (transaction.blockNumber - recentBlockNum).toString(10),
    timestamp,
  }));
};

async function etheriumCheckInLoop() {
  console.log("tick..");
  // get recent block
  const recentBlockNum = await getRecentBlockNumber();

  // is it in DB already ?
  const recentBlock = await getBlockByNumber(recentBlockNum);
  if (recentBlock) {
    etheriumCheckInLoop();
    return;
  }

  await updateAllExistingTransactions(recentBlock);
}

module.exports = {
  getBlockByNumber,
  getTransactionByHash,
  getTransactionsByBlockNumber,
  getRecentBlockNumber,
  getFirstBlocks,
  getDataFromEtherium,
  addBlockTransactionsToDB,
  addBlockToDB,
  updateAllExistingTransactions,
  etheriumCheckInLoop,
};
