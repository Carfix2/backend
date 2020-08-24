export const en = {
    DENT_REMOVAL: {
        ordinal: 0,
        display: 'Dent Removal',
    },
    SCRATCH_REMOVAL: {
        ordinal: 1,
        display: 'Scratch Removal',
    },
    SPRAY_PAINTING: {
        ordinal: 2,
        display: 'Spray Painting',
    },
    OTHER: {
        ordinal: 3,
        display: 'Other(Refer to Additional Details)',
    },
};

export const ordinalToEnum = {};

for (const key in en) {
    ordinalToEnum[en[key].ordinal] = en[key];
}