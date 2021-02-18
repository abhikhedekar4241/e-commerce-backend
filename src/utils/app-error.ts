class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  // For error handling
  code: any;
  path: any;
  value: any;
  errmsg: any;
  errors: any;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
