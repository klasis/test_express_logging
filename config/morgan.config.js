const morgan = require('morgan');
const logger = require('./winston.config.js');
const moment = require('moment-timezone');

require('dotenv').config();

const morganMiddleware = morgan((tokens, req, res) => {
    const logMsg = `${ tokens.method(req, res) } ${ tokens.url(req, res) } ${ tokens.status(req, res) } ${ tokens.res(req, res, 'content-length') } - ${ tokens['response-time'](req, res) } ms\n(${ tokens['user-agent'](req, res) })`;

    const statusCode = res.statusCode;

    // 응답 상태가 성공일 경우
    if (statusCode < 400) {
        if (process.env.NODE_ENV === 'production') {
            logger.info(logMsg);
        } else {
            console.info(`[${ moment().tz(process.env.SERVER_LOCATION).format('YYYY-MM-DD HH:mm:ss Z z') }] [INFO]: ${ logMsg }`);
        }
    }

    return null;
});

module.exports = morganMiddleware;