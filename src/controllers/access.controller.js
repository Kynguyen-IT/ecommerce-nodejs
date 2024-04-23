const { CREATED } = require("../core/success.respone");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    const { metadata } = await AccessService.signUp(req.body);

    new CREATED({
      metadata,
      message: "Success: created shop",
    }).send(res);
  };
}

module.exports = new AccessController();
