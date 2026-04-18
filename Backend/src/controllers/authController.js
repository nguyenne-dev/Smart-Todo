const catchAsync = require("../utils/catchAsync");

const {
  LoginService,
  RegisterService,
  ForgotPasswordService,
  ResetPasswordService,
  VerifyRegisterService,
} = require("../services/authService");

// Register a new user
exports.register = catchAsync(async (req, res, next) => {
  const data = req.body;
  if (data.dateOfBirth && isNaN(Date.parse(data.dateOfBirth))) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid date of birth format (yyyy-mm-dd)",
    });
  }
  if (!data.username || !data.password || !data.email) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide username, password, and email",
    });
  }

  const { token } = await RegisterService(data);
  res
    .status(200)
    .json({
      status: "success",
      message: "Registration successful, verification email sent",
    });
});

exports.verifyRegister = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid verification token",
    });
  }
  const data = await VerifyRegisterService(token);
  res.status(200).json({
    status: "success",
    message: "Email verification successful",
    data,
  });
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  const data = req.body;
  if (!data.username || !data.password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide username and password",
    });
  }

  const user = await LoginService(data);
  res.cookie("token", user.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: user.user,
  });
});

// Forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const data = req.body;
  if (!data.username && !data.email) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide either username or email",
    });
  }
  const result = await ForgotPasswordService(data);
  res.status(200).json({
    status: "success",
    message: "Password reset email sent",
    data: result,
  });
});

// Reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid reset token",
    });
  }
  const data = req.body;
  if (!data.password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a new password",
    });
  }

  const result = await ResetPasswordService(token, data);
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    data: result,
  });
});

// Logout user
exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
