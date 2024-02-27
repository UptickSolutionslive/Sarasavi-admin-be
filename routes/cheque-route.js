var express = require('express');
var router = express.Router();

const controller = require("../controllers/cheque-controller");



router.route("/").get((req, res) => {
    controller.getAllCheques(req, res);
})



module.exports = router;