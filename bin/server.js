const mongoose = require("mongoose");
require("dotenv").config();
mongoose.Promise = global.Promise;
const app = require("../app");
// const http = require("http");
// const { etheriumCheckInLoop, putFirstBlocksToDB } = require("../services/etherium-services");

const PORT = process.env.PORT || "3001";
app.set("port", PORT);

// const server = http.createServer(app);
// server.listen("3002");

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
  // server.on("listening", async () => {
  //   const loopId = setTimeout(async function () {
  //     await putFirstBlocksToDB(100);
  //     await etheriumCheckInLoop();
  //   }, 10000);
  // });
} catch (error) {
  console.log("DB connection Error: ", error);
  process.exit(1);
}

module.exports = mongoose;
