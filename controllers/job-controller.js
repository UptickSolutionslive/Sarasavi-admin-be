"use strict";
var JobService = require("../services/job-service");
var response = require("../utils/response-utils");

async function createJob(req, res) {
  try {
    const result = await JobService.createJob(req);
    if (result.status === 200) {
      return response.sendSuccessResponse(
        "Job saved successfully",
        result,
        res
      );
    } else {
      if (result.error.code == 11000) {
        return response.sendBadRequestResponse(
          "Job already exist",
          null,
          result.error,
          res
        );
      }
      return response.sendBadRequestResponse(
        "Error while saving job",
        null,
        result.error,
        res
      );
    }
  } catch (err) {
    return response.sendServerErrorResponse(
      "Error while saving job",
      null,
      err,
      res
    );
  }
}

async function activateJob(req, res) {
  try {
    const result = await JobService.activateJob(req);
    if (result.status === 200) {
      return response.sendSuccessResponse(
        "Job activated successfully",
        result,
        res
      );
    } else {
      return response.sendBadRequestResponse(
        "Error while activatingssdewe job",
        null,
        result.error,
        res
      );
    }
  } catch (err) {
    return response.sendServerErrorResponse(
      "Error while activating job",
      null,
      err,
      res
    );
  }
}

async function getAllJobs(req, res) {
  try {
    const result = await JobService.getJobs();
    if (result.status === 200) {
      return response.sendSuccessResponse("Jobs fetched successfully", result, res);
    } else {
      return response.sendBadRequestResponse("Error while fetching jobs", null, result.error, res);
    }
  }
  catch (err) {
    return response.sendServerErrorResponse("Error while fetching jobs", null, err, res);
  }

}

module.exports = {
  createJob,
  activateJob,
  getAllJobs,
};
