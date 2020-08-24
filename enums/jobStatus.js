export const en = {
    CREATED: {
        ordinal: 0,
        display: 'Job Sent to Mechanics',
    },
    IN_PROCESS: {
        ordinal: 1,
        display: 'Quotes Received, waiting for confirmation from Driver',
    },
    ACCEPTED: {
        ordinal: 2,
        display: 'Accepted Quote. Sent for repair',
    },
    COMPLETE: {
        ordinal: 3,
        display: 'Job Complete',
    },
};

export const ordinalToEnum = {};

for (const key in en) {
    ordinalToEnum[en[key].ordinal] = en[key];
}