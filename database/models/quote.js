import mongoose from 'mongoose'
const Schema = mongoose.Schema;
import * as quoteStatus from '../../enums/quoteStatus'

const quoteSchema = Schema({
    _id: Schema.Types.ObjectId,
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    quoteFromMechanic: {
        type: Schema.Types.ObjectId,
        ref: 'Mechanic'
    },
    costs: {
        type: Map,
        of: Number
    },
    quoteStatus: {
        type: Number,
        required: true,
        default: quoteStatus.en.OFFERED.ordinal,
    },
    notesFromMechanic: {
        type: String,
    },
    additionalDetails: {
        type: String
    },
    repairByDate: {
        type: Date,
    }
})

const Quote = mongoose.model('Quote', quoteSchema);

export { quoteSchema }
export default Quote;
