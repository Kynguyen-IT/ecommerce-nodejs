"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publickKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publickKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });

    //refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });

    // verify access token
    JWT.verify(accessToken, publickKey, (err, decode) => {
      if (err) {
        console.log("Error verifi::", err);
        return;
      }

      console.log("Decode verifi::", decode);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error create token pair", error);
  }
};

module.exports = {
  createTokenPair,
};
