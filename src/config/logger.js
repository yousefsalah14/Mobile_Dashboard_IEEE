import winston from 'winston'


const format = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});


export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        format
    ),
    transports: [
        new winston.transports.Console(), 
        // new winston.transports.File({ filename: 'app.log' }) 
    ]
})