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
    HOOD: {
        ordinal: 5,
        display: 'Hood (Front)'
    },
    BONNET: {
        ordinal: 6,
        display: 'Bonnet/Boot (Rear)'
    },
    FENDER_FRONT_LEFT: {
        ordinal: 7,
        display: 'Fender (Front Left)'
    },
    FENDER_FRONT_RIGHT: {
        ordinal: 8,
        display: 'Fender (Front Right)'
    },
    FENDER_REAR_LEFT: {
        ordinal: 9,
        display: 'Fender (Rear Left)'
    },
    FENDER_REAR_RIGHT: {
        ordinal: 10,
        display: 'Fender (Rear Right)'
    },
    BUMBER_FRONT: {
        ordinal: 11,
        display: 'Bumper (Front)'
    },
    BUMPER_REAR: {
        ordinal: 12,
        display: 'Bumper (Rear)'
    },
    HEADLIGHTS_FRONT_LEFT: {
        ordinal: 13,
        display: 'Headlights (Front Left)'
    },
    HEADLIGHTS_FRONT_RIGHT: {
        ordinal: 14,
        display: 'Headlights (Front Right)'
    },
    TAILLIGHTS_REAR_LEFT: {
        ordinal: 15,
        display: 'Taillights (Rear Left)'
    },
   TAILLIGHTS_REAR_RIGHT: {
        ordinal: 16,
        display: 'Taillights (Rear Right)'
    },
    SIDEMIRROR_LEFT: {
        ordinal: 17,
        display: 'SideMirror (Left)'
    },
    SIDEMIRROR_LEFT: {
        ordinal: 18,
        display: 'SideMirror (Right)'
    },
    DOOR_FRONT_LEFT: {
        ordinal: 19,
        display: 'Door (Front Left)'
    },
    DOOR_FRONT_RIGHT: {
        ordinal: 20,
        display: 'Door (Front Right)'
    },
    DOOR_REAR_LEFT: {
        ordinal: 21,
        display: 'Door (Rear Left)'
    },
    DOOR_REAR_RIGHT: {
        ordinal: 22,
        display: 'Door (Rear Right)'
    },
    DOOR_HANDLE_FRONT_LEFT: {
        ordinal: 23,
        display: 'Door Handle (Front Left)'
    },
    DOOR_HANDLE_FRONT_RIGHT: {
        ordinal: 24,
        display: 'Door Handle (Front Right)'
    },
    DOOR_HANDLE_REAR_LEFT: {
        ordinal: 25,
        display: 'Door Handle (Rear Left)'
    },
    DOOR_HANDLE_REAR_RIGHT: {
        ordinal: 26,
        display: 'Door Handle (Rear Right)'
    },
    DOOR_CHROME_MOONING_FRONT_LEFT: {
        ordinal: 27,
        display: 'Door Chrome Mooning (Front Left)'
    },
    DOOR_CHROME_MOONING_FRONT_RIGHT: {
        ordinal: 28,
        display: 'Door Chrome Mooning (Front Right)'
    },
    DOOR_CHROME_MOONING_REAR_LEFT: {
        ordinal: 29,
        display: 'Door Chrome Mooning (Rear Left)'
    },
    DOOR_CHROME_MOONING_REAR_RIGHT: {
        ordinal: 30,
        display: 'Door Chrome Mooning (Rear Right)'
    },
    BUMPER_GRILL: {
        ordinal: 31,
        display: 'Bumper Grill'
    },
    FRONT_GRILL: {
        ordinal: 32,
        display: 'Front Grill'
    },
    OTHER: {
        ordinal: 999,
        display: 'Other(Check additional details)'
    }
    
};

export const ordinalToEnum = {};

for (const key in en) {
    ordinalToEnum[en[key].ordinal] = en[key];
}