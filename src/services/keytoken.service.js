const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyTokenWithPublicKey = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const token = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return token ? token.publicKey : null;
    } catch (error) {
      console.log("Error create keytoken", error);
    }
  };

  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const token = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return token ? token.publicKey : null;
    } catch (error) {
      console.log("Error create keytoken", error);
    }
  };
}

module.exports = KeyTokenService;
