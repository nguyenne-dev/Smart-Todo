const User = require("../models/userModel");
const Token = require("../models/tokenModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const sendMail = require("../utils/sendMail");

// Register a new user
const RegisterService = async (data) => {
  const existingUserName = await User.findOne({ username: data.username });
  if (existingUserName) {
    throw new AppError("Username already exists", 400);
  }
  const existingEmail = await User.findOne({ email: data.email });
  if (existingEmail) {
    throw new AppError("Email already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = { ...data, password: hashedPassword };
  const token = jwt.sign({ newUser }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  await Token.create({
    userId: null,
    token: token,
    expiresAt: Date.now() + 60 * 60 * 1000,
  });
  const verificationLink = `${process.env.FRONTEND_URL}/verify-register/${token}`;
  const htmlContent = `
  <p>You requested to verify your email. Click the link below to verify your email:</p>
  <a href="${verificationLink}">Verify Email</a>
  <p>This link will expire in 1 hour.</p>
  `;
  const mailSent = await sendMail(
    newUser.email,
    "Email Verification Request",
    htmlContent,
  );
  return { token };
};

const VerifyRegisterService = async (token) => {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  const existingToken = await Token.findOne({ token, used: false });

  if (!existingToken) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  if (existingToken.expiresAt < Date.now()) {
    throw new AppError("Token expired", 400);
  }

  const existingUser = await User.findOne({
    $or: [
      { username: decoded.newUser.username },
      { email: decoded.newUser.email },
    ],
  });

  if (existingUser) {
    await Token.findOneAndUpdate({ token }, { used: true });
    throw new AppError("Username or email already exists", 400);
  }

  const newUser = await User.create(decoded.newUser);

  await Token.findOneAndUpdate({ token }, { used: true });

  return { user: newUser };
};

// Login user
const LoginService = async (data) => {
  const existingUser = await User.findOne({
    username: data.username,
    status: "active",
  });
  const isPasswordValid =
    existingUser &&
    (await bcrypt.compare(data.password, existingUser.password));
  if (!isPasswordValid) {
    throw new AppError("Invalid username or password", 401);
  }
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user = existingUser.toObject();
  delete user.password;
  return { token, user: user };
};

// Forgot password
const ForgotPasswordService = async (data) => {
  const user = await User.findOne({
    status: "active",
    $or: [{ username: data.username }, { email: data.email }],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const resetToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await Token.create({
    userId: user._id,
    token: resetToken,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  const htmlContent = `
  <p>You requested a password reset. Click the link below to reset your password:</p>
  <a href="${resetLink}">Reset Password</a>
  <p>This link will expire in 15 minutes.</p>
  `;
  const mailSent = await sendMail(
    user.email,
    "Password Reset Request",
    htmlContent,
  );
  return { success: mailSent };
};

// Reset password
const ResetPasswordService = async (token, data) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    existingToken = await Token.findOne({ token: token, used: false });
    if (!existingToken || existingToken.used) {
      throw new AppError("Invalid or expired reset token", 400);
    }
  } catch (err) {
    throw new AppError("Invalid or expired reset token", 400);
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await User.findOneAndUpdate(
    { _id: decoded.id },
    { password: hashedPassword },
  );
  await Token.findOneAndUpdate({ token: token }, { used: true });
  return { success: true };
};

module.exports = {
  LoginService,
  RegisterService,
  VerifyRegisterService,
  ForgotPasswordService,
  ResetPasswordService,
};
