const errorHandler = (err, req, res, next) => {
    // 1. Determine the status code: use the error's own status or default to 500
    const statusCode = err.statusCode || 500;

    // 2. Log the error for the developer
    console.error(`[Error] ${err.message}`);

    // 3. Send the response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || "Internal Server Error",
    });
};



export default errorHandler;