const express = require("express");
const router = express.Router();
const transactionsControllers = require("../controllers/transactions-controllers");

router.get("/recipient/:addr", transactionsControllers.getTransactionsByRecipientAddr);
router.get("/sender/:addr", transactionsControllers.getTransactionsBySenderAddr);
router.get("/block/:blockNumber", transactionsControllers.getTransactionsByBlockNum);
router.get("/:transactionId", transactionsControllers.getTransactionById);

module.exports = router;
