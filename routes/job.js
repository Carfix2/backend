const router = require("express").Router();
import mongoose from "mongoose";
import { sendBadRequest, sendJSONResponse } from "../utils";
import Job from "../database/models/job";
import Quote from '../database/models/quote'
import { jobValidationSchema } from "../utils/schema";
import * as jobStatus from '../enums/jobStatus'
import _ from 'lodash'

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'quotes'
      });

    return sendJSONResponse(res, 200, "OK", job);
  } catch (err) {
    console.log(err);
    return sendBadRequest(res, 400, err);
  }
});

router.post("/", async (req, res) => {

  const job = {
    _id: new mongoose.Types.ObjectId(),
    requestDriver: req.body.requestDriver,
    partsDamaged: req.body.partsDamaged,
    serviceTypeRequired: req.body.serviceTypeRequired,
    carDetails: {
      regYear: req.body.carRegYear,
      licenseNum: req.body.carLicenseNum,
      modelName: req.body.carModelName,
      modelNum: req.body.carModelNum,
    },
    noteFromDriver: req.body.noteFromDriver,
    additionalRequest: req.body.additionalRequest,
    requestedRepairDate: req.body.requestedRepairDate,
  }

  try {
    const result = await jobValidationSchema.validateAsync()

    const jobMongoObj = new Job(job);

    const savedJob = await jobMongoObj.save();
    return sendJSONResponse(res, 200, "OK", savedJob);
  } catch (err) {
    console.log(err);
    return sendBadRequest(res, 400, err);
  }
});

router.get('/mechanic/open/:mechanicId', async (req, res) => {
  try {
    const openJobs = await Job.find({ "jobStatus":  { "$in" : [jobStatus.en.CREATED.ordinal, jobStatus.en.IN_PROCESS.ordinal]}})

    const quotesFromMechanic = await Quote.find({ quoteFromMechanic: req.params.mechanicId })
    const jobIdsForMechanic = quotesFromMechanic.map(quote => quote.jobId.toString())
    
    const updatedOpenJobs = openJobs.filter(job => {
      return !jobIdsForMechanic.includes(job._id.toString())
    })

    return sendJSONResponse(res, 200, 'OK', updatedOpenJobs)
  } catch(err) {
    return sendBadRequest(res, 400, err)
  }
})

router.get('/mechanic/completed/:mechanicId', async (req, res) => {
  try {
    const mechanicId = req.params.mechanicId

    const completedJobsForMechanic = await Job.find({ jobStatus: jobStatus.en.COMPLETE.ordinal, assignedMechanic: mechanicId})

    return sendJSONResponse(res, 200, 'OK', completedJobsForMechanic)
  } catch(err) {
    return sendBadRequest(res, 400, err)
  }
})

router.get('/mechanic/quoted/:mechanicId', async (req, res) => {
  try {
    const mechanicId = req.params.mechanicId;

    const quotesFromMechanic = await Quote.find({ quoteFromMechanic: mechanicId })

    const jobIds = quotesFromMechanic.map(quote => quote.jobId)

    const jobsBidByMechanic = await Job.find({
      _id : { "$in" : jobIds},
      jobStatus: jobStatus.en.IN_PROCESS.ordinal
    })

    return sendJSONResponse(res, 200, 'OK', jobsBidByMechanic)
  } catch(err) {
    return sendBadRequest(res, 400, err)
  }
})

router.get('/mechanic/accepted/:mechanicId', async (req, res) => {
  try {
    const mechanicId = req.params.mechanicId

    const acceptedJobsForMechanic = await Job.find({ jobStatus: jobStatus.en.ACCEPTED.ordinal, assignedMechanic: mechanicId})

    return sendJSONResponse(res, 200, 'OK', acceptedJobsForMechanic)
  } catch(err) {
    return sendBadRequest(res, 400, err)
  }
})

router.post('/complete/:id', async(req, res) => {
  try {

    const completedJob = await Job.findByIdAndUpdate(req.params.id, {
      jobStatus: jobStatus.en.COMPLETE.ordinal,
    }, {new: true})

    return sendJSONResponse(res, 200, 'OK', completedJob)
    
  } catch (error) {
    console.log(error)
    return sendBadRequest(res, 400, error)
  }
})


export default router;
