import axios from "axios";

import { AUTH_URL } from "../../../constants/constants";

// *************************** Auth *************************** //
// register
const register = async (formData) => {
  const response = await axios.post(`${AUTH_URL}/register`, formData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  console.log(response.data);

  return response.data;
};

// login
const login = async (formData) => {
  const response = await axios.post(`${AUTH_URL}/login`, formData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// logout
const logout = () => {
  localStorage.removeItem("user");
};

// forgot password
const forgotPassword = async (formData) => {
  const response = await axios.post(`${AUTH_URL}/forgot-password`, formData);

  return response.data;
};

// get user profile
const getProfile = async (token) => {
  const response = await axios.get(`${AUTH_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// update user profile
const updateProfile = async (userData, token) => {
  const response = await axios.put(`${AUTH_URL}/update-profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// delete user profile by user
const deleteUserProfileByUser = async (token) => {
  const response = await axios.delete(`${AUTH_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// delete user profile by admin
const deleteUserProfileByAdmin = async (token, userId) => {
  const response = await axios.delete(`${AUTH_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// get all users profile by admin
const getAllUsersProfileByAdmin = async (token) => {
  const response = await axios.get(`${AUTH_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// get user profile by id
const getUserProfileById = async (userId) => {
  const response = await axios.get(`${AUTH_URL}/user/${userId}`);

  return response.data;
};

const authServices = {
  register,
  login,
  logout,
  forgotPassword,
  getProfile,
  updateProfile,
  deleteUserProfileByUser,
  deleteUserProfileByAdmin,
  getAllUsersProfileByAdmin,
  getUserProfileById,
};

export default authServices;
