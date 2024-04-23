"use strict";

const ApiKeyService = require("../services/apikey.servive");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    // check key from apikey
    const objKey = await ApiKeyService.findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log("Error check api key", error);
  }
};

const permission = () => {
  return (req, res, next) => {
    const premissions = req?.objKey?.premissions;
    if (!premissions) {
      return res.status(403).json({
        message: "premission denied",
      });
    }

    const isValidPermisson = premissions.includes("0000");

    if (!isValidPermisson) {
      return res.status(403).json({
        message: "premission denied",
      });
    }

    return next();
  };
};

const asynHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asynHandler,
};
