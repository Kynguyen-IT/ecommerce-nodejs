const crypto = require("crypto");
const apikeyModel = require("../models/apikey.model");

class ApiKeyService {
  static findById = async (key) => {
    try {
      const objkey = await apikeyModel.findOne({ key, status: true }).lean();
      return objkey;
    } catch (error) {
      console.log("Error find api key", error);
    }
  };

  static createApiKey = async () => {
    try {
      const key = crypto.randomBytes(64).toString("hex");
      const objkey = await apikeyModel.create({ key, premissions: ["0000"] });
      return objkey;
    } catch (error) {
      console.log("Error create api key", error);
    }
  };
}

module.exports = ApiKeyService;
