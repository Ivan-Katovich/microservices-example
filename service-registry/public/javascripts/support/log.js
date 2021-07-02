const winston = require('winston');
const moment = require('moment');
const now = moment().format('YYYY-MM-DD_HH-mm-ss');
const { combine, timestamp, label, prettyPrint, printf, colorize } = winston.format;

const logLevels = {
    levels: {
        FATAL: 0,
        ERROR: 1,
        WARN: 2,
        INFO: 3,
        DEBUG: 4,
        TRACE: 5
    },
    colors: {
        FATAL: 'red',
        ERROR: 'magenta',
        WARN: 'cyan',
        INFO: 'blue',
        DEBUG: 'yellow',
        TRACE: 'gray'
    }
};

winston.addColors(logLevels.colors);

class CustomLogger {}

CustomLogger.myFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const colorized = combine(
    colorize({all: true}),
    label({ label: 'right meow!' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    CustomLogger.myFormat
);

const monochrome = combine(
    // colorize({all: true}),
    label({ label: 'right meow!' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    CustomLogger.myFormat
);

CustomLogger.logger = winston.createLogger({
    levels: logLevels.levels,
    // level: 'method',
    transports: [
        // new winston.transports.File({
        //     filename: `reports/logs/winston-basic_${globalConfig.thread}_${now}.log`,
        //     level: 'method',
        //     format: monochrome
        // }),
        new winston.transports.Console({
            level: 'INFO',
            format: colorized
        })
    ]
});

module.exports = CustomLogger;
