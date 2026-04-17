const isValidEmail = (email) => {
  return /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (email && !isValidEmail(email)) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid email",
    });
  }

  next();
};

module.exports = validateEmail;
