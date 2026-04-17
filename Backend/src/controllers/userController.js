const { getMe, updateMe, changePasswordService } = require("../services/userService");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const data = await getMe(id);
  res.status(200).json({
    status: "success",
    message: "Get user",
    data,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const data = req.body;
  const user = await updateMe(id, data);
  res.status(200).json({
    status: "success",
    message: "User updated",
    data: user,
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const data = await changePasswordService(req.user.id, req.body);
  res.status(200).json({
    status: "success",
    message: "Password changed",
    data,
  });
});

exports.changeAvatar = catchAsync(async (req, res, next) => {
  // const data = await this.changeAvatar(req.user.id, req.file);
  res.status(200).json({
    status: "success",
    message: "Avatar changed",
    // data
  });
});
