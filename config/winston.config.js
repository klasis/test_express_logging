const winston = require('winston');
const path = require('path');
const fs = require('fs');
const winstonDailyRotate = require('winston-daily-rotate-file');
const moment = require('moment-timezone');

require('dotenv').config();

// 로그 디렉토리 가져오기 (없으면 생성)
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// 로그 레벨 정의
const logLevels = {
    error: 0,
    info: 1,
    debug: 2
};

// 로그 포맷 정의
const logFormat = winston.format.combine(
    // winston.format.timestamp({ format: () => new Date().toLocaleString('en-US', { timeZone: process.env.SERVER_LOCATION, timeZoneName: 'short', hour12: false, day: '2-digit', month: '2-digit', year: '2-digit', second: '2-digit', minute: '2-digit', hour: '2-digit' }) }),
    winston.format.timestamp({ format: () => moment().tz(process.env.SERVER_LOCATION).format('YYYY-MM-DD HH:mm:ss Z z') }),
    winston.format.printf(({ level, message, timestamp }) => {
        return `[${ timestamp }] [${ level.toUpperCase() }]: ${ message }`;
    })
);

// 로그 공통 옵션
const logPublicOptions = {
    utc: true,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    // 로그 파일을 30일간 보관
    maxFiles: '30d',
    format: logFormat
};

// 로그 구성
const logger = winston.createLogger({
    levels: logLevels,
    format: logFormat,
    defaultMeta: { service: 'user-service' },
    transports: [
        new winstonDailyRotate(Object.assign({ level: 'error', dirname: path.join(logDir, 'error'), filename: 'error-%DATE%.log' }, logPublicOptions)),
        new winstonDailyRotate(Object.assign({ level: 'info', dirname: path.join(logDir, 'info'), filename: 'info-%DATE%.log' }, logPublicOptions)),
        new winstonDailyRotate(Object.assign({ level: 'debug', dirname: path.join(logDir, 'debug'), filename: 'debug-%DATE%.log' }, logPublicOptions)),
    ],
    // 정의되지 않은 레벨의 예외 처리
    exceptionHandlers: [
        new winstonDailyRotate(Object.assign({ dirname: path.join(logDir, 'unknown'), filename: 'unknown-%DATE%.log' }, logPublicOptions))
    ],
    // 정의되지 않은 레벨의 예외 처리 후 서버 실행 지속
    exitOnError: false
});

module.exports = logger;