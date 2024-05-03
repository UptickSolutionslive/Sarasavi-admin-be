var express = require("express");
var router = express.Router();

var JobController = require("../controllers/job-controller");

router.route("/").post((req, res) => {
  JobController.createJob(req, res);
});

router.route("/").get((req, res) => {
  JobController.getAllJobs(req, res);
});

router.route("/:id").patch((req, res) => {
  JobController.activateJob(req, res);
});

router.route("/:id").delete((req, res) => {
  JobController.deletedJob(req, res);
});

router.route("/:id").put((req, res) => {
  JobController.updateJob(req, res);
});

module.exports = router;
