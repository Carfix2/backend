import express from "express"
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import nconf from 'nconf';
import { setupConfigs } from './config/config'
import { connectDb } from './database'
import jobRoutes from './routes/job'
import driverRoutes from './routes/driver'
import mechanicRoutes from './routes/mechanic'
import quoteRoutes from './routes/quote'

const server = express();

const serverInit = (async () => {

    setupConfigs();
    const mongoConn = await connectDb();

    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(cookieParser());

    server.get('/health', (req, res) => {
        return res.status(200).json({
            "Is Working?": "Yes"
        })
    })

    server.use('/job', jobRoutes)
    server.use('/mechanic', mechanicRoutes)
    server.use('/driver', driverRoutes)
    server.use('/quote', quoteRoutes)


    const host = process.env.PORT || nconf.get('host')
    server.listen(host, () => console.log(`Example app listening on port ${host}!`));

    return server;

})

export default serverInit()
