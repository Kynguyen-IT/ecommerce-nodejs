"use strict";

const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");

const END_POINT_MONGODB = `mongodb://${host}:${port}/${name}`;
const MAX_POLL_SIZE = 50;

class DataBase {
  constructor() {
    this.connect();
  }

  // connect mongoDB
  connect() {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(END_POINT_MONGODB, { maxPoolSize: MAX_POLL_SIZE })
      .then((_) => {
        console.log("Connected mongodb Success");
      })
      .catch((e) => console.log("Error connect mongoDB: ", e));
  }

  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }

    return DataBase.instance;
  }
}

// simpleton design pattens
const instanceMongoDB = DataBase.getInstance();

module.exports = instanceMongoDB;
