const router = require("express").Router();
import mongoose from "mongoose";
import { sendBadRequest, sendJSONResponse } from "../utils";
import Job from "../database/models/job";
import Quote from '../database/models/quote'
import * as jobStatus from '../enums/jobStatus'
import * as quoteStatus from '../enums/quoteStatus'


router.get('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id).populate({
            path: 'jobId'
        })

        return sendJSONResponse(res, 200, 'OK', quote)
    } catch (error) {
        return sendBadRequest(res, 400, error)
    }
})

router.post('/', async (req, res) => {
    try {
        
        const jobId = req.body.jobId;

        const quote = new Quote({
            _id: new mongoose.Types.ObjectId(),
            jobId,
            quoteFromMechanic: req.body.mechanicId,
            costs: req.body.costs,
            notesFromMechanic: req.body.notesFromMechanic,
            additionalDetails: req.body.additionalDetails,
            repairByDate: req.body.repairByDate,
        })

        const savedQuote = await quote.save()

        const updatedJob = await Job.findByIdAndUpdate(jobId, {
            jobStatus: jobStatus.en.IN_PROCESS.ordinal,
            "$push" : {
                quotes: savedQuote._id
            }
        }, {new: true})

        return sendJSONResponse(res, 200, 'OK', updatedJob)
    } catch (error) {
        console.log(error)
        return sendBadRequest(res, 400, error)
    }
})

router.post('/accept/:id', async(req, res) => {
    try {

        const quoteIdAccepted = req.params.id

        const acceptedQuote = await Quote.findByIdAndUpdate(quoteIdAccepted, {
            quoteStatus: quoteStatus.en.ACCEPTED.ordinal,
        }, {new: true})

        const updatedJob = await Job.findByIdAndUpdate(acceptedQuote.jobId, {
            jobStatus: jobStatus.en.ACCEPTED.ordinal,
            acceptedQuote: acceptedQuote._id,
            assignedMechanic: acceptedQuote.quoteFromMechanic
        }, {new: true})

        return sendJSONResponse(res, 200, 'OK', updatedJob)
    } catch (error) {
        console.log(error)
        return sendBadRequest(res, 400, error)
    }
})



export default router;