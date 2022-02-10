const express = require("express");
const router = express.Router();
const transactionsControllers = require("../controllers/transactions-controllers");

// eth_getBlockByNumber и eth_getTransactionByHash
router.get("/getAll", transactionsControllers.getAll);
router.get("/block/:blockNumber", transactionsControllers.getBlockByNumber);
router.get("/:transactionHash", transactionsControllers.getTransactionByHash);

module.exports = router;
