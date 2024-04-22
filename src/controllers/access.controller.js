const accessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      const signUpShop = await accessService.signUp(req.body);
      return res.status(201).json(signUpShop);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
