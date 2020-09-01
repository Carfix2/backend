import Joi from 'joi';

export const jobValidationSchema = Joi.object({
    requestDriver: Joi.string(),
    serviceTypeRequired: Joi.array().items(Joi.number()),
    partsDamaged: Joi.array().items(Joi.number()),
    carDetails: Joi.object({
        regYear: Joi.number(),
        licenseNum: Joi.string(),
        modelName: Joi.string(),
        modelNum: Joi.string(),
    }),
    noteFromDriver: Joi.string().allow(null),
    additionalRequest: Joi.string().allow(null),
    requestedRepairDate: Joi.date().allow(null)

})