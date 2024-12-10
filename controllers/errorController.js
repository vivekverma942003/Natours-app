const AppError = require('./../utils/appError');
const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}:${err.value}.`;
  return new AppError(msg, 400);
};
const handleDuplicateNameErrorDB = (err) => {
  const key = Object.keys(err.keyValue).join('');
  const msg = `The key '${key}' has duplicate value of '${err.keyValue[key]}'`;
  return new AppError(msg, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err).map((el) => el.message);
  const msg = `invalid entered data ${errors.join('. ')}`;
  return new AppError(msg, 400);
};

const handleErrorJWT = () => {
  return new AppError('invalid token, plx log in again ', 401);
};

const handleTokenExpireError = () => {
  return new AppError('your token is Expired . please log in again', 401);
};

const sendErrorDev = (res, req, err) => {
  // for api
  if (req.originalURL && req.originalURL.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  // for rendere website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (res, req, err) => {
  // for API
  if (req.originalURL && req.originalURL.startsWith('/api')) {
    // operational error ... trusted error send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // programming or any unknown message

    // 1) log the error
    console.error('ERROR 💣', err);
    //2)send the generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  } else {
    // for rendered website
    // operational error ... trusted error send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    }
    // programming or any unknown message
    else {
      // 1) log the error
      console.error('ERROR 💣', err);
      //2)send the generic message
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'try again later',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, req, err);
  } else {
    /// creatign error handler for the error come from the database itself
    let error = { ...err }; //created a hard copy of the err
    error.message = err.message;
    //1) invalid id --- casterror
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    //2) duplicate name --- error.code=11000 (see in the log)
    if (error.code == 11000) error = handleDuplicateNameErrorDB(error);
    //3) validation error errr.name==='ValidationError
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleErrorJWT();
    if (error.name === 'TokenExpiredError') error = handleTokenExpireError();
    /// production env
    sendErrorProd(res, req, error);
  }
};
