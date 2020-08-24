import mongoose from 'mongoose';
import nconf from 'nconf'

const connectDb = () => {
    return mongoose.connect(
        nconf.get("mongo:url"), { 
            useNewUrlParser: true,
            dbName: nconf.get("mongo:dbName"),
            user: nconf.get("mongo:user"),
            pass: nconf.get("mongo:pass"),
        }
    );
};

export { connectDb };
