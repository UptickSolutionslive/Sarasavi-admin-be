const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-controller')

router.route("/login").post((req, res) => {
    controller.Login(req, res);
})
router.route("/registerUser").post((req, res) => {
    controller.registerUser(req, res);
})
router.route("/getAllUsers").get((req, res) => {
    controller.getAllUsers(req, res);
});

router.route("/deleteUser/:userId").delete((req, res) => {
    const userId = req.params.userId;
    req.body.userId = userId; 
    controller.deleteUser(req, res);
});

router.route("/updateUser/:userId").put((req, res) => {
    const userId = req.params.userId;
    req.body.userId = userId; 
    controller.updateUser(req, res);
});


module.exports = router; 