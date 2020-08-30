import mongoose from 'mongoose'
const Schema = mongoose.Schema;
import * as jobStatus from '../../enums/jobStatus'
import * as serviceType from '../../enums/serviceType'
import * as carParts from '../../enums/carParts'

const jobSchema = Schema({
    _id: Schema.Types.ObjectId,
    requestDriver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'
    },
    quotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Quote'
    }],
    serviceTypeRequired: {
        type: [Number],
        default: [serviceType.en.OTHER.ordinal]
    },
    partsDamaged: {
        type: [Number],
        default: [carParts.en.OTHER.ordinal]
    },
    carDetails: {
        regYear: {
            type: Number,
        },
        licenseNum: {
            type: String,
        },
        modelName: {
            type: String,
        },
        modelNum: {
            type: String,
        },
    },
    images: [{
        url: {
            type: String,
        },
        metadata: {
            type: String
        }
    }],
    jobStatus: {
        type: Number,
        required: true,
        default: jobStatus.en.CREATED.ordinal,
    },
    noteFromDriver: {
        type: String,
    },
    additionalRequest: {
        type: String
    },
    requestedRepairDate: {
        type: Date,
    },
    acceptedQuote: {
        type: Schema.Types.ObjectId,
        ref: 'Quote'
    },
    assignedMechanic : {
        type: Schema.Types.ObjectId,
        ref: 'Mechanic'
    }
})

const Job = mongoose.model('Job', jobSchema);

export { jobSchema }
export default Job;
