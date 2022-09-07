const { moveBlocks } = require("../utils/move-blocks");

async function mine() {
  await moveBlocks(2, 1000);
}

mine()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
