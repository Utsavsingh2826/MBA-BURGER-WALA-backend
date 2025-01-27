// Error Middleware
export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // Default status code to 500 for internal server error
    err.message = err.message || "Internal Server Error";
  
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  };
  
  // Async Error Handler
  export const asyncError = (passedFunction) => (req, res, next) => {
    Promise.resolve(passedFunction(req, res, next)).catch((err) => {
      next(err); // Pass the error to the error middleware
    });
  };
  