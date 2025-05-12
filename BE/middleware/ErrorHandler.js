const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate email address' });
  }
  res.status(500).json({ message: 'Server error' });
};

export default errorHandler;