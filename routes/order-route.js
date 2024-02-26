var express = require('express');
var router = express.Router();

const controller = require("../controllers/order-controller");


router.route("/").post((req, res) => {
    controller.createOrder(req, res);
})
router.route("/:id").delete((req, res) => {
    controller.deleteOrder(req, res);
})
router.route("/").get((req, res) => {
    controller.getAllOrders(req, res);
})
router.route("/activate/:id").put((req,res)=>{
    controller.activateJob(req,res);
})
router.route("/activate/").get((req, res) => {
    controller.getActivateJobs(req, res);
})

router.route("/deactivate/").get((req, res) => {
    controller.getDeactivateJobs(req, res);
})




module.exports = router;