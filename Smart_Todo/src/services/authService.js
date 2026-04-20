import { get, post } from "../utils/request";

export const UserLogin = async (option) => {
  const result = post("api/auth/login", option);
  return result;
}

export const register = async (option) => {
  const result = post("api/auth/register", option);
  return result;
}

export const verify_register = async (token) => {
  const result = await get(`api/auth/verify-register/${token}`);
  return result;
}

export const logout = async (option) => {
  const result = await post("api/auth/logout", option)
  return result;
}