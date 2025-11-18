export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default function globalErrorFilter(err, req, res, next) {
  const { type, message:errorText } = err;

  let status = 500;
  let message;
  let errorCode = "INTERNAL_SERVER_ERROR";

  if (type === "ValidationError") {
    status = 400;
    errorCode = "BAD_REQUEST";
  } else if (type === "LogicalValidationError") {
    status = 409;
    errorCode = "CONFLICT";
  } else if (type === "BusinessLogicError") {
    status = 409;
    errorCode = "CONFLICT";
  }
  else if (type === "NotAuthorizedError") {
    status = 403;
    errorCode = "FORBIDDEN";
  }
  else if (type === "UnAuthorizedError") {
    status = 401;
    errorCode = "UNAUTHORIZED";
  }
  else if (type === "InvalidTokenError") {
    status = 498;
    errorCode = "INVALID_TOKEN";
  }
  else if (type === "AuthenticationError") {
    status = 401;
    errorCode = "AUTHENTICATION_FAILED";
  }

  message = errorText;

  const response = {
    status,
    errorCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  console.error(response);

  res.status(status).json(response);
}
