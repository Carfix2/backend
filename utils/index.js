export const sendJSONResponse = (res, status, message, data) => {
    const jsonResponse = {
        metadata: {
            status,
            message,
        },
        data,
    };

    res.status(status);
    return res.send(jsonResponse);

}

export const sendBadRequest = (res, status, errMsg) => {
    return sendJSONResponse(res, status, errMsg);
}

export const isProductionEnv = () => {
    return process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "production"
}

export const isStagingEnv = () => {
    return process.env.NODE_ENV == "staging"
}
