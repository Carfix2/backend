import nconf from 'nconf';
import path from 'path';


export const setupConfigs = () => {
    let env;

    nconf.argv().env();

    switch (process.env.NODE_ENV) {
        case 'staging':
            env = 'staging';
            break;
        case 'prod':
        case 'production':
            env = 'prod';
            break;
        case 'test':
            env = 'test';
            break;
        default:
            env = 'local';
            break;
    }

    nconf.file('config', {
        file: path.join(__dirname, `config.${env}.json`),
    });

    return nconf;
};