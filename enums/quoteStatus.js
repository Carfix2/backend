export const en = {
    OFFERED: {
        ordinal: 0,
        display: 'Quoted Cost for Job',
    },
    ACCEPTED: {
        ordinal: 1,
        display: 'Accepted Quote. Sent for repair',
    },
};

export const ordinalToEnum = {};

for (const key in en) {
    ordinalToEnum[en[key].ordinal] = en[key];
}