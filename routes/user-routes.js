const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-controller')

router.route("/login").post((req, res) => {
    controller.Login(req, res);
})

module.exports = router; 