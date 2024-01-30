var express = require('express');
var router = express.Router();

let User = require("../models/customer-model")

const controller = require("../controllers/customer-controller");


router.route("/").post((req, res) => {
    controller.CreateCustomer(req, res);
})

router.route("/").get((req, res) => {
    controller.getAllCustomer(req, res);
})

router.route("/:id").put((req, res) => {
    controller.updateCustomer(req,res);
})

router.route("/:id").delete((req, res) => {
    controller.deleteCustomer(req,res);
})


//get one of the user
//http://localhost:3000/user/get/:id
router.route("/get/:id").get((req, res) => {
    let id = req.params.id;
    User.findById(id).then((user) => {
        res.json(user)
    }).catch((err) => {
        console.log(err);
    })
})


module.exports = router;