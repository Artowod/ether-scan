const express = require("express");
const router = express.Router();
const etheriumControllers = require("../controllers/etherium-controllers");

// --------------------------
// - requests to API etherscan.io - for dev mode only EXCEPT INITIALIZING!
// --------------------------
//+ getRecentBlockNumber
//+ getBlockByNumber
//+ getTransactionsByBlockNumber
//+ getTransactionByHash
// --------------------------

// for PROD!---------------
router.get("/initializing", etheriumControllers.startUpdating); //+
router.get("/stop", etheriumControllers.stopUpdating); //+
//-------------------------

//------------for dev mode only----------------
router.get("/block/recent", etheriumControllers.getRecentBlockNumber); //+
router.get("/block/:blockNumber", etheriumControllers.getBlockByNumber); //+
router.get("/transactions/:blockNumber", etheriumControllers.getTransactionsByBlockNumber); //+
router.get("/transaction/:hash", etheriumControllers.getTransactionByHash); //+
//---------------------------------------------

module.exports = router;
