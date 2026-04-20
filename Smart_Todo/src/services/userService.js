import { get, post } from "../utils/request";

export const getMe = async () => {
  const result = get("api/users/me");
  return result;
}

export const updateInfo = async (option) => {
  const result = await post(`api/user/me/update`, option);
  return result;
}

export const changePass = async (option) => {
  const result = await post(`api/user/me/change-pass`, option);
  return result;
}