export default (err, _, res, __) => {
  const { status = 500, message = 'An error has occurred' } = err;
  res.status(status).json({ status, message });
};
