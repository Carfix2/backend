export const en = {
    LEFT_DOOR: {
        ordinal: 0,
        display: 'Left Door',
    },
    RIGHT_DOOR: {
        ordinal: 1,
        display: 'Right Door',
    },
    LEFT_FENDER: {
        ordinal: 2,
        display: 'Left Fender',
    },
    RIGHT_FENDER: {
        ordinal: 3,
        display: 'Right Fender',
    },
    BUMPER: {
        ordinal: 4,
        display: 'Bumper',
    },
    OTHER: {
        ordinal: 5,
        display: 'Other(Check additional details)'
    }
    
};

export const ordinalToEnum = {};

for (const key in en) {
    ordinalToEnum[en[key].ordinal] = en[key];
}