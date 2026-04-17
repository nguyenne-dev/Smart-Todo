const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");

const getMe = async (id) => {
  const user = await User.findById(id).select("-password");
  return user;
};

const updateMe = async (id, data) => {
  // Only allow updating specific fields
  const allowedFields = ["gender", "dateOfBirth", "phone", "address"];

  // Filter out fields that are not allowed to be updated
  const filteredData = {};
  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredData[key] = data[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    id,
    { $set: filteredData },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) throw new AppError("User not found", 404);

  return user;
};

const changePasswordService = async (id, data) => {
  const user = await User.findById(id).select("+password");
  if (!user) throw new AppError("User not found", 404);
  const isMatch =
      (await bcrypt.compare(data.currentPassword, user.password));
  if (!isMatch) throw new AppError("Current password is incorrect", 400);
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return { message: "Password changed successfully" };
};

const changeAvatar = async (id, file) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);
};
module.exports = { getMe, updateMe, changePasswordService, changeAvatar };
