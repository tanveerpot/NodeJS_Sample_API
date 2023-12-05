const catchResponse = ({ res, err }) => {
  let statusCode = 500;
  let error = "Server Error";

  if (err.statusCode) ({ statusCode } = err);

  if (err.message) ({ message: error } = err);
  else if (err.error) ({ error } = err);

  res.status(statusCode).json({
    success: false,
    error,
  });
};

export default catchResponse;
