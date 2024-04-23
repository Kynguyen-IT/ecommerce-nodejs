const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.respone");
const { findByEmail } = require("./shop.servicer");

const ROLE_SHOPS = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDIt: "EDIT",
  AMDIN: "ADMIN",
};

class AccessService {
  static signUpCryptoGenerateToken = async ({ name, email, password }) => {
    try {
      const hoderShop = await shopModel.findOne({ email }).lean();

      if (hoderShop) {
        throw new BadRequestError("Error: shop already resgistered");
      }

      // hash password
      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: ROLE_SHOPS.SHOP,
      });

      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        const publicKeyString =
          await KeyTokenService.createKeyTokenWithPublicKey({
            userId: newShop._id,
            publicKey,
          });

        if (!publicKeyString) {
          return {
            code: "xxx",
            massage: "publicKeyString Error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey
        );

        const user = getIntoData({
          fileds: ["name", "email", "_id"],
          object: newShop,
        });

        return {
          code: 201,
          metadata: {
            user,
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        error: error,
        staus: "error",
      };
    }
  };

  static signUp = async ({ name, email, password }) => {
    const hoderShop = await shopModel.findOne({ email }).lean();

    if (hoderShop) {
      throw new BadRequestError("Error: shop already resgistered");
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: ROLE_SHOPS.SHOP,
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      // create key Token
      const keyToken = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyToken) {
        throw new BadRequestError("Error: create key token");
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      // format info user
      const user = getIntoData({
        fileds: ["name", "email", "_id"],
        object: newShop,
      });

      return {
        code: 201,
        metadata: {
          ...user,
          ...tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const existShop = findByEmail(email);
    if (!existShop) {
      throw new BadRequestError("Error: Email does not exist");
    }

    const isMatchPassword = bcrypt.compare(password, existShop.password);

    if (!isMatchPassword) {
      throw new AuthFailureError("Error: password is incorrect");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: existShop._id, email },
      publicKey,
      privateKey
    );

    const user = getIntoData({
      fileds: ["name", "email", "_id"],
      object: newShop,
    });

    return {
      metadata: {
        ...user,
        ...tokens,
      },
    };
  };
}

module.exports = AccessService;
