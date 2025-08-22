import constant from "../constant.js";
const errorHandler = async (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constant.BAD_REQUEST:
      return res.json({
        success:false,
        title: "Bad request",
        message: err.message,
        stacktrace: err.stack,
      });
    case constant.FORBIDDEN:
      return res.json({
        success:false,
        title: "FORBIDDEN",
        message: err.message,
        stacktrace: err.stack,
      });
    case constant.UNAUTHORIZED:
      return res.json({
        success:false,
        title: "UNAUTHORIZED",
        message: err.message,
        stacktrace: err.stack,
      });
    case constant.NOT_FOUND:
      return res.json({
        success:false,
        title: "NOT_FOUND",
        message: err.message,
        stacktrace: err.stack,
      });
    case constant. INTERNAL_SERVER_ERROR:
      return res.json({
        success:false,
        title: " INTERNAL_SERVER_ERROR",
        message: err.message,
        stacktrace: err.stack,
      });
    default :
     console.log("All good , no error!!")
     break;
  }
};

export default errorHandler