#!/usr/bin/env node

/**
 * Module dependencies.
 */
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.Promise = global.Promise;

const app = require("../app");
const debug = require("debug")("etherscan-back:server");
const http = require("http");
const { etheriumCheckInLoop } = require("../services/etherium-services");

/**
 * Get port from environment and store in Express.
 */

const PORT = process.env.PORT || "3001";
app.set("port", PORT); //????

/**
 * Create HTTP server.
 */

const server = http.createServer(app); //????

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen("3002");

// server.on("error", onError);
// server.on("listening", () => console.log("Server is online."));
// server.on("listening", () => {
//   getRecentBlockNumber();
// });

try {
  const session = mongoose.connect(process.env.DB_HOST_REMOTE);
  session.then((data) => {
    data.connections[0].name &&
      app.listen(PORT, () => {
        const { port, name } = data.connections[0];
        console.log(`Database connection successfully. DB name is "${name}" on port "${port}".`);
        console.log("PORT", PORT);
      });
  });
  server.on("listening", () => {
    etheriumCheckInLoop();
    // const loopId = setInterval(etheriumCheckInLoop, 5000);
  });
} catch (error) {
  console.log("DB connection Error: ", error);
  process.exit(1);
}
//==================================================
//==================================================
//==================================================

// server.on("listening", initialDataPushingToDB);
// server.on("listening", CESCheck);

// server.on("listening", () => {
//   const recentBlockNum = getRecentBlockNumber();
//   setTimeout(() => {
//     getBlockByNumber("0xd87bb8");
//   }, 2000);
//   getRecentBlockNumber();
//   getFirstBlocks(40);
// });

//????
//====================================================================

// server.on("listening", () => {
//   const loopId = setInterval(etheriumCheckInLoop, 5000);
// });

//====================================================================
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
 * Event listener for HTTP server "error" event.
 */

// function onError(error) {
//   if (error.syscall !== "listen") {
//     throw error;
//   }

//   var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " requires elevated privileges");
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(bind + " is already in use");
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// }

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening() {
//   console.log("HI!");
//   var addr = server.address();
//   var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
//   debug("Listening on " + bind);
// }

module.exports = mongoose;
