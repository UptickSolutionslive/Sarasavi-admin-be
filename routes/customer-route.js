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

//update
router.route("/update/:id").put(async (req, res) => {
    let userId = req.params.id;
    const { name, mobileNo, email, address, cPerson, cMobileNo, remark, creditLimit } = req.body;
    const updateUser = {
        name,
        mobileNo,
        email,
        address,
        cPerson,
        cMobileNo,
        remark,
        creditLimit

    }

    const update = await User.findByIdAndUpdate(userId, updateUser).then(() => {
        res.status(200).send({ status: "User Updated" })
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ status: "Error with updating data" });
    })
})

//delete user
router.route("/delete/:id").delete(async (req, res) => {
    let userId = req.params.id;

    await User.findByIdAndDelete(userId).then(() => {
        res.status(200).send({ status: "User deleted" });
    }).catch((err) => {
        console.log(err);
    })
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