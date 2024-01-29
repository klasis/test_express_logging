const logger = require('./winston.config.js');
const moment = require("moment-timezone");

function errorMiddleware (err, req, res, next) {
    const statusCode = err.status;
    res.status(statusCode).send(err.message);

    const stackLines = err.stack.split('\n');
    const truncatedStack = stackLines.slice(0, 5).join('\n');
    const reqBodyStr = JSON.stringify(req.body);

    const errMsg = `${ req.method } ${ req.path } ${ statusCode }\n[REQUEST] ${ reqBodyStr } ${ truncatedStack }`;

    if (process.env.NODE_ENV === 'production') {
        logger.error(errMsg);
    } else {
        console.error(`[${ moment().tz(process.env.SERVER_LOCATION).format('YYYY-MM-DD HH:mm:ss Z z') }] [ERROR]: ${ errMsg }`);
    }
}

module.exports = errorMiddleware;