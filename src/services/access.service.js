const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const ROLE_SHOPS = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDIt: "EDIT",
  AMDIN: "ADMIN",
};

class AccessService {
  signUp = async ({ name, email, password }) => {
    try {
      const hoderShop = await shopModel.findOne({ email }).lean();
      if (hoderShop) {
        return {
          code: "xxx",
          massage: "shop already registered",
          staus: "error",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: ROLE_SHOPS.SHOP,
      });

      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log({ privateKey, publicKey });
      }

      // return {
      //   code: 201,
      //   staus: "success",
      //   data: newShop,
      // };
    } catch (error) {
      return {
        code: "xxx",
        massage: error.massage,
        staus: "error",
      };
    }
  };
}

module.exports = new AccessService();
