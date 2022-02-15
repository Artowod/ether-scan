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
    console.log("Error in getDataFromEtherium: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
    else next(err.errno);
  }
}

//+ needs for controllers
async function addTransactionsToDB(transactions) {
  try {
    const result = await Transaction.create(transactions);
    if (!result) throw new Error("Bad request");
  } catch (err) {
    console.log("Error in addTransactionsToDB: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
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
    //     console.log("block ", minimizedBlock);
    const result = await Block.create(minimizedBlock);
    if (!result) throw new Error("Bad request");
  } catch (err) {
    console.log("Error in addBlockToDB: ", err.errno);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
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
  // console.log("RB:", recentBlock);
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

    // console.log("--------------------------------------");
    // console.log(`Block num: ${blockNumber}`);
    // console.log("--------------------------------------");
    // console.log(data.result);
    return data.result;
  } catch (err) {
    if (err.errno === -4077) console.log(`Can not get the block ${blockNumber}. Timeout exeeded. `);
    else console.log("Error in : getBlockByNumber. Error number is ", err.errno);
  }
}

async function getTransactionsByBlockNumber(blockNumber) {
  /* Returns information about transactions of block by block number. */
  try {
    console.log("Getting Block and its transactions by number...");
    const params = {
      module: "proxy",
      action: "eth_getBlockByNumber",
      tag: blockNumber,
      boolean: true,
      apikey: process.env.API_KEY,
    };
    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    return data.result.transactions;
  } catch (error) {
    console.log("Error: ", error);
  }
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
    // console.log("recentBlock", recentBlock);
    const allData = await Transaction.find();
    //  Transaction.updateMany({}, { $set: { confirmations: (transaction.blockNumber - recentBlockNum).toString(10) } });
    // console.log("allData", allData);
    const { number: recentBlockNum } = recentBlock;
    // const result = allData.map((transaction) => ({
    //   ...transaction,
    //   confirmations: (transaction.blockNumber - recentBlockNum).toString(10),
    // }));

    for (const { hash, blockNumber } of allData) {
      // console.log("hash", hash);
      // console.log("blockNumber", blockNumber);
      // console.log("recentBlockNum", recentBlockNum);
      const confirmations = parseInt(recentBlockNum, 16) - parseInt(blockNumber, 16);
      // console.log(confirmations);
      await Transaction.findOneAndUpdate({ hash }, { confirmations });
    }
  } catch (err) {
    console.log("Error in updateAllExistingTransactions: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
  }

  /*
 =====cool example if we need parralel work==========
async function printFiles () {
  const files = await getFilePaths();

  await Promise.all(files.map(async (file) => {
    const contents = await fs.readFile(file, 'utf8')
    console.log(contents)
  }));
}
=====cool example if we need parralel work==========

*/

  // const result = async allData.map(({ hash, blockNumber }) => {
  //   await Transaction.findOneAndUpdate({ hash }, { confirmations: (recentBlockNum - blockNumber).toString(10) });
  // });
};

const addFieldsToRecentBlockTransactions = async (recentBlock) => {
  try {
    // console.log("-recentBlock", recentBlock);
    const recentBlockTransactions = await getTransactionsByBlockNumber(recentBlock.number);
    // console.log("-recentBlockTransactions", recentBlockTransactions);
    const { timestamp, baseFeePerGas } = recentBlock;
    const modifiedTransactions = recentBlockTransactions.map((transaction) => {
      //fee in eth
      // TWO VARIANT !!! - what is Correct ???

      // in etherium docs!
      const baseFeePerGasNumber = +baseFeePerGas.toString(16);
      const gasNumber = +transaction.gas.toString(16);
      const maxFeePerGasNumber = transaction.maxFeePerGas ? +transaction.maxFeePerGas.toString(16) : 0;
      const transactionFee = (
        ((baseFeePerGasNumber + maxFeePerGasNumber) * gasNumber) /
        1000000000 /
        1000000000
      ).toFixed(9);
      console.log(transactionFee);

      // on https://etherscan.io/tx/
      // const gasNumber = +transaction.gas.toString(16);
      // const gasPriceNumber = +transaction.gasPrice.toString(16);
      // const transactionFee = ((gasPriceNumber * gasNumber) / 1000000000 / 1000000000).toFixed(9);
      // console.log(transactionFee);

      return {
        ...transaction,
        timestamp,
        confirmations: 0,
        transactionFee,
      };
    });

    return modifiedTransactions;
  } catch (err) {
    console.log("Error in addFieldsToRecentBlockTransactions: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
  }

  // const allData = await Transaction.find();
  // const { number = recentBlockNum, timestamp, baseFeePerGas } = recentBlock;
  // allData.map((transaction) => ({
  //   ...transaction,
  //   confirmations: (transaction.blockNumber - recentBlockNum).toString(10),
  //   timestamp,
  // }));
};

async function etheriumCheckInLoop() {
  console.log("tick..");
  // get recent block from etherium
  const recentBlockNum = await getRecentBlockNumber();

  // is it in DB already ?
  const isRecentBlockInDB = await Block.findOne({ number: recentBlockNum });
  if (isRecentBlockInDB) {
    etheriumCheckInLoop();
    return;
  }
  const recentBlock = await getBlockByNumber(recentBlockNum);

  // modify transactions by adding fields necessary for frontend
  const modifiedTransactions = await addFieldsToRecentBlockTransactions(recentBlock);

  const { hash, number, size, timestamp, baseFeePerGas, transactions } = recentBlock;

  const minimizedBlock = {
    hash,
    number,
    size,
    timestamp,
    baseFeePerGas,
    transactionsCount: transactions.length,
  };
  // console.log("block ", minimizedBlock);

  // store simplified block data to DB
  const result = await Block.create(minimizedBlock);

  await addTransactionsToDB(modifiedTransactions);
  await updateAllExistingTransactions(recentBlock);
  console.log("DONE");
}

module.exports = {
  getBlockByNumber,
  getTransactionByHash,
  getTransactionsByBlockNumber,
  getRecentBlockNumber,
  getFirstBlocks,
  getDataFromEtherium,
  addTransactionsToDB,
  addBlockToDB,
  updateAllExistingTransactions,
  etheriumCheckInLoop,
};
