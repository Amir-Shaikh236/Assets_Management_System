export default class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;

        // Derive status mapping dynamically from the HTTP status code range
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Mark as operational so our centralized handler knows it is safe to report to the user
        this.isOperational = true;

        // Capture the stack trace cleanly while omitting this constructor call from the output
        Error.captureStackTrace(this, this.constructor);
    }
}
