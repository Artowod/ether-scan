const express = require("express");
const router = express.Router();
const etheriumControllers = require("../controllers/etherium-controllers");

router.get("/recent", etheriumControllers.getRecentBlockNumber);
router.get("/block/:blockNumber", etheriumControllers.getBlockByNumber);
router.get("/transactions/:blockNumber", etheriumControllers.getTransactionsByBlockNumber);
router.get("/transactions/:hash", etheriumControllers.getTransactionByHash);

module.exports = router;
