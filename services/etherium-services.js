/* ----------------- Etherium data to DB - streaming Handling ------------------ */

const Block = require("../Schemas/block-schema");

async function pushBlockToDB(data) {
  try {
    //    const result = await Block.find(data);
    let block = {};
    console.log("Getting Block...");
    return block;
  } catch (error) {
    console.log("Error: ", error);
  }
}
module.exports = { pushBlockToDB };
