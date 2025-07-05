const { updateOnlineStatus } = require("./Controllers/attendence.controller");

let isRunning = false;

async function safeUpdate() {
  if (isRunning) return;
  isRunning = true;
  await updateOnlineStatus(
    { }, // fake req
    { json: () => {}, status: () => ({ json: () => {} }) } // fake res
  );
  isRunning = false;
}

setInterval(safeUpdate, 6000); // 6 seconds
safeUpdate(); // Initial
