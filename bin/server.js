#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("etherscan-back:server");
var http = require("http");
const {
  initialDataPushingToDB,
  CESCheck,
  getBlockByNumber,
  getTransactionByHash,
  getTransactionsByBlockNumber,
} = require("../controllers/etherium-controllers");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

//==================================================
//==================================================
//==================================================

// server.on("listening", initialDataPushingToDB);
// server.on("listening", CESCheck);
server.on("listening", () => {
  getBlockByNumber("0xD860F2");
});

// server.on("listening", () => {
//   getTransactionsByBlockNumber("0xD860F2");
// });

// server.on("listening", () => {
//   getTransactionByHash("4ce799d88a1c1d0f4bfcda5645be8275d14e8daf5da969a28fa8161d604e3cc6");
// });

//==================================================
//==================================================
//==================================================

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log("HI!");
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
