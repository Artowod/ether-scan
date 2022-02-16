/* ----------------- Etherium data to DB - streaming Handling ------------------ */
const axios = require("axios");
const { Block } = require("../Schemas/block-schema");
const { Transaction } = require("../Schemas/transaction-schema");

let isLoopStarted = false;

async function startUpdating() {
  try {
    isLoopStarted = true;
    await putFirstBlocksToDB(30);
    await etheriumCheckInLoop();
  } catch (err) {
    console.log("Initializing error", err);
  }
}

function getIsLoopStartedStatus() {
  return isLoopStarted;
}

function stopUpdating() {
  isLoopStarted = false;
}

//+ needs for controllers
async function getDataFromEtherium(params) {
  try {
    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    return data;
  } catch (err) {
    console.log("Error in getDataFromEtherium: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
    else next(err);
  }
}

//+ needs for controllers
async function addTransactionsToDB(transactions) {
  console.log("Adding transactions to DB...");
  try {
    const result = await Transaction.create(transactions);
    if (!result) throw new Error("Bad request");
    console.log("Transactions added.");
  } catch (err) {
    console.log("Error in addTransactionsToDB: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
  }
}

//+ needs for controllers
async function addBlockToDB({ hash, number, size, timestamp, baseFeePerGas, transactions }) {
  try {
    console.log("Adding block to DB...");
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
      transactions, // for new approach in my mind :(
      transactionsCount: transactions.length,
    };
    const result = await Block.create(minimizedBlock);
    if (!result) throw new Error("Bad request");
    console.log("Block added.");
  } catch (err) {
    console.log("Error in addBlockToDB: ", err.errno);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
  }
}

//------------------------------------------------------------------------------
// needs for etheriumCheckInLoop function (transactions update and store to DB)
//------------------------------------------------------------------------------

async function getConfirmationsCount(currentBlockNum) {
  console.log("Counting how many blocks appeared after current block...");
  const params = {
    module: "proxy",
    action: "eth_blockNumber",
    apikey: process.env.API_KEY,
  };
  const recentBlock = await getDataFromEtherium(params);
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
    if (err.errno === -4077) console.log(`Can not get the block ${blockNumber}. Timeout exeeded. `);
    else console.log("Error in getRecentBlockNumber: ", err);
  }
}

async function putFirstBlocksToDB(number) {
  let recentBlockNumber = await getRecentBlockNumber();
  recentBlockNumber = parseInt(recentBlockNumber, 16);

  try {
    for (let i = 0; i < number; i += 1) {
      console.log("--------------------------");
      console.log("Block num: ", recentBlockNumber);
      if (await Block.findOne({ number: recentBlockNumber.toString(16) })) continue;
      const block = await getBlockByNumber(recentBlockNumber.toString(16), true);
      if (!block) continue; //in case of timeout exeeded - try again current block
      const isBlockExists = await addBlockToDB(block);
      if (isBlockExists) continue;
      const modifiedFieldTransactions = addFieldsToBlockTransactions(block);
      await addTransactionsToDB(modifiedFieldTransactions);
      recentBlockNumber -= 1;
    }
    console.log("--------------------------");
    console.log(`First ${number} blocks and its transactions added to DB.`);
  } catch (err) {
    console.log("Error in : putFirstBlocksToDB", err);
  }
}

async function getBlockByNumber(blockNumber, isFullTransactions = false) {
  /* Returns information about a block by block number. */
  try {
    console.log("Getting Block by number...");
    const params = {
      module: "proxy",
      action: "eth_getBlockByNumber",
      tag: blockNumber,
      boolean: isFullTransactions,
      apikey: process.env.API_KEY,
    };

    const { data } = await axios.get(`https://api.etherscan.io/api`, { params });
    return data.result;
  } catch (err) {
    if (err.errno === -4077) console.log(`Can not get the block ${blockNumber}. Timeout exeeded. `);
    else console.log("Error in : getBlockByNumber. Error number is ", err);
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
      return { success };
    })
    .catch((error) => console.log("Error: ", error));
}

const updateAllExistingTransactions = async (recentBlock) => {
  try {
    console.log("Updating Confirmation Num in all transactions...");
    const allData = await Transaction.find();
    const { number: recentBlockNum } = recentBlock;
    for (const { hash, blockNumber } of allData) {
      // console.log("hash", hash);
      // console.log("blockNumber", blockNumber);
      // console.log("recentBlockNum", recentBlockNum);
      const confirmations = parseInt(recentBlockNum, 16) - parseInt(blockNumber, 16);
      // console.log(confirmations);
      await Transaction.findOneAndUpdate({ hash }, { confirmations });
    }
    console.log("Updating completed.");
  } catch (err) {
    console.log("Error in updateAllExistingTransactions: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
  }

  /*
 ===== example if we need parralel work==========
async function printFiles () {
  const files = await getFilePaths();

  await Promise.all(files.map(async (file) => {
    const contents = await fs.readFile(file, 'utf8')
    console.log(contents)
  }));
}
=====cool example if we need parralel work==========
*/
};

const addFieldsToBlockTransactions = (block) => {
  try {
    console.log("Transactions: ", block.transactions.length);
    // const recentBlockTransactions = await getTransactionsByBlockNumber(recentBlock.number);
    const blockTransactions = block.transactions;
    const { timestamp, baseFeePerGas } = block;
    const modifiedTransactions = blockTransactions.map((transaction) => {
      //fee in eth
      // TWO VARIANT !!! - what is Correct ???

      // in etherium docs!
      const baseFeePerGasNumber = parseInt(baseFeePerGas, 16);
      const gasNumber = parseInt(transaction.gas, 16);
      const maxFeePerGasNumber = transaction.maxFeePerGas ? parseInt(transaction.maxFeePerGas, 16) : 0;

      const transactionFee = (
        ((baseFeePerGasNumber + maxFeePerGasNumber) * gasNumber) /
        1000000000 /
        1000000000
      ).toFixed(9);
      // result is double checked - correct !
      // console.log("---", baseFeePerGasNumber, " ", gasNumber, " ", maxFeePerGasNumber, " = ", transactionFee);

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
    console.log("Error in addFieldsToBlockTransactions: ", err);
    if (err.errno === -4077) console.log(`Can not get the data. Timeout exeeded. `);
  }
};

async function etheriumCheckInLoop() {
  console.log("tick..");
  // get recent block from etherium
  const recentBlockNum = await getRecentBlockNumber();
  console.log("Recent Block num: ", recentBlockNum);

  const isRecentBlockInDB = await Block.findOne({ number: recentBlockNum });
  if (isRecentBlockInDB || !recentBlockNum) {
    etheriumCheckInLoop();
    return;
  }
  const recentBlock = await getBlockByNumber(recentBlockNum, true);
  // modify transactions by adding fields necessary for frontend
  const modifiedTransactions = await addFieldsToBlockTransactions(recentBlock);

  await addBlockToDB(recentBlock);
  await addTransactionsToDB(modifiedTransactions);
  await updateAllExistingTransactions(recentBlock);
  console.log("NEXT ITTERATION.");
  if (isLoopStarted) etheriumCheckInLoop();
  console.log("DONE");
}

module.exports = {
  startUpdating,
  stopUpdating,
  getIsLoopStartedStatus,
  getBlockByNumber,
  getTransactionByHash,
  getTransactionsByBlockNumber,
  getRecentBlockNumber,
  putFirstBlocksToDB,
  getDataFromEtherium,
  addTransactionsToDB,
  addBlockToDB,
  updateAllExistingTransactions,
  etheriumCheckInLoop,
};
