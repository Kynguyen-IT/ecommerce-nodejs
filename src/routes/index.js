"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check apikey
router.use(apiKey);

// check permission
router.use(permission());

router.use("/v1/api", require("./access"));

module.exports = router;
