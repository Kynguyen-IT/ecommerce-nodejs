"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`number of connection mongodb: ${numConnection}`);
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // maximum number of connection based on number osf cores
    const maxConnection = numCore * 5;
    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log("Connection overload detected");
      // send notifi
    }
  }, _SECONDS); // monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverLoad,
};
