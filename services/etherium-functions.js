const axios = require("axios");
require("dotenv").config();

function initialDataPushingToDB() {
  const id = setInterval(() => {
    console.log("Tick.");
    axios
      .get(`http://localhost:3000/api/transactions/234235235`)
      .then((data) => console.log("Data about transaction: ", data.data))
      .catch((error) => console.log("Error: ", error));
  }, 2000);
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

function CESCheck() {
  /* Check Contract Execution Status */

  console.log("Contract status check...");
  const params = {
    module: "transaction",
    action: "getstatus",
    txhash: "0x15f8e5ea1079d9a0bb04a4c58ae5fe7654b5b2b4463375ff7ffb490aa0032f3a",
    apikey: process.env.API_KEY,
  };
  axios
    .get(`https://api.etherscan.io/api`, { params })
    .then(({ data }) => console.log("Check Status result: ", data))
    .catch((error) => console.log("Error: ", error));
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
    return data.result.transactions.length;
  } catch (err) {
    if (err.errno === -4077) console.log(`Can not get the block ${blockNumber}. Timeout exeeded. `);
    else console.log("Error in : getBlockByNumber. Error number is ", err.errno);
  }
  //   axios
  //     .get(`https://api.etherscan.io/api`, { params })
  //     .then(({ data }) => {
  //       console.log("--------------------------------------");
  //       console.log(`Block num: ${blockNumber}`);
  //       console.log("--------------------------------------");
  //       console.log(data.result);
  // services.pushBlockToDB(data);

  //.catch((error) => console.log("Error: ", error));
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

/* eth_getBlockByNumber */
// https://api.etherscan.io/api
//    ?module=proxy
//    &action=eth_getBlockByNumber
//    &tag=0x10d4f
//    &boolean=true
//    &apikey=YourApiKeyToken

/* eth_getTransactionByHash */
// https://api.etherscan.io/api
//    ?module=proxy
//    &action=eth_getTransactionByHash
//    &txhash=0xbc78ab8a9e9a0bca7d0321a27b2c03addeae08ba81ea98b03cd3dd237eabed44
//    &apikey=YourApiKeyToken

module.exports = {
  initialDataPushingToDB,
  CESCheck,
  getBlockByNumber,
  getTransactionByHash,
  getTransactionsByBlockNumber,
  getRecentBlockNumber,
  getFirstBlocks,
};
