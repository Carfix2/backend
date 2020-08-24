const router = require('express').Router();
import mongoose from 'mongoose';
import { sendBadRequest, sendJSONResponse } from '../utils'
import Job from '../database/models/job'

router.get('/:id', async (req, res) => {

    try {
        const job = await Job.findById(req.params.id)

        return sendJSONResponse(res, 200, 'OK', job)
    } catch(err) {
        console.log(err)
        return sendBadRequest(res, 400, err)

    }

})

router.post('/', async (req, res) => {

    try {
        const job = new Job({
            _id: new mongoose.Types.ObjectId(),
            partsDamaged: req.body.partsDamaged,
            carDetails : {
                regYear: req.body.carRegYear,
                licenseNum: req.body.carLicenseNum,
                modelName: req.body.carModelName,
                modelNum: req.body.carModelNum
            },
            noteFromDriver: req.body.noteFromDriver,
            additionalRequest: req.body.additionalRequest,
            requestedRepairDate: new Date()

        })

        const savedJob = await job.save();
        return sendJSONResponse(res, 200, 'OK', savedJob)
        
    } catch(err) {
        console.log(err);
        return sendBadRequest(res, 400, err)
    }
})


export default router
