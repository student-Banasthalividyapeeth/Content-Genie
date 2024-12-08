const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  };
  
  module.exports = {
    errorHandler,
  };


  //The stack trace provides valuable information about the sequence of function calls that led to the error being thrown.