"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");

router.post("/shop/signup", accessController.signUp);
router.get("/shop/signup", (req, res, next) => {
    console.log(req)
    return res.status(200).json({type: '4dsadsa45'})
});

module.exports = router;
