import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authServices from "./authServices";

const user = JSON.parse(localStorage.getItem("user")); // user  because it is stored as a string in local storage

const initialState = {
  user: user ? user : null,
  guest: null,
  users: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// *************************** Auth *************************** //
// register
export const register = createAsyncThunk(
  "auth/register",
  async ({ formData, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await authServices.register(formData);
      navigate("/");
      toast.success(response?.message);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(error.response?.data?.msg);
      return rejectWithValue(message);
    }
  }
);

// login
export const login = createAsyncThunk(
  "auth/login",
  async ({ formData, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await authServices.login(formData);
      navigate("/");
      toast.success(response?.message);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(error.response?.data?.message);
      return rejectWithValue(message);
    }
  }
);

// logout
export const logout = createAsyncThunk("auth/logout", async () => {
  authServices.logout();
});

// forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ formData, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await authServices.forgotPassword(formData);
      toast.success(response?.message);
      navigate("/login");
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(error.response?.data?.msg);
      return rejectWithValue(message);
    }
  }
);

// Get user profile
export const userProfile = createAsyncThunk(
  "auth/userProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await authServices.getProfile(token);

      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ userData, token, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await authServices.updateProfile(userData, token);
      toast.success(response?.message);
      navigate("/profile");
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete user profile by user
export const userDeleteProfile = createAsyncThunk(
  "auth/userDeleteProfile",
  async ({ token, toast, navigate }, thunkAPI) => {
    try {
      const response = await authServices.deleteUserProfileByUser(token);
      toast.success(response?.message);
      thunkAPI.dispatch(logout());
      navigate("/login");
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user profile by admin
export const adminDeleteUserProfileBy = createAsyncThunk(
  "auth/adminDeleteUserProfileBy",
  async ({ token, userId, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await authServices.deleteUserProfileByAdmin(
        token,
        userId
      );
      toast.success(response?.message);
      navigate("/");
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

// Get all users by admin
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (token, { rejectWithValue }) => {
    try {
      const response = await authServices.getAllUsersProfileByAdmin(token);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

// Get user by id
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await authServices.getUserProfileById(userId);

      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // Register a user
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Login a user
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = payload;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Logout a user
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = null;
    });
    builder.addCase(logout.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Forgot password
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isError = false;
      state.isSuccess = true;
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = action.payload;
    });

    // Get user profile
    builder.addCase(userProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userProfile.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = payload;
    });
    builder.addCase(userProfile.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Update user profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = payload;
    });
    builder.addCase(updateUserProfile.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Delete user profile by user
    builder.addCase(userDeleteProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userDeleteProfile.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = null;
    });
    builder.addCase(userDeleteProfile.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Delete user profile by admin
    builder.addCase(adminDeleteUserProfileBy.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(adminDeleteUserProfileBy.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(adminDeleteUserProfileBy.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Get all users
    builder.addCase(getAllUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.users = payload;
    });
    builder.addCase(getAllUsers.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Get user by id
    builder.addCase(getUserById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserById.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.guest = payload;
    });
    builder.addCase(getUserById.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });
  },
});

export const { clearState } = authSlice.actions;

export default authSlice.reducer;
