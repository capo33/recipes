import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import categoryServices from "./categoryServices";

const initialState = {
  categories: [],
  category: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// Get categories
export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryServices.getAllCategories();
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

// Get category by slug
export const getCategoryBySlug = createAsyncThunk(
  "category/getCategoryBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await categoryServices.getCategoryBySlug(slug);
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

// Create category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ categoryData, token, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await categoryServices.createCategory(
        categoryData,
        token
      );
      navigate("/categories");
      toast.success(response?.message);
      console.log("response", response);

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

// Update category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, categoryData, token, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await categoryServices.updateCategory(
        id,
        categoryData,
        token
      );

      navigate("/categories");
      console.log("response", response);
      toast.success(response?.message);
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

// Delete category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (
    { id, token, toast }, // navigate,
    thunkAPI
  ) => {
    try {
      const response = await categoryServices.deleteCategory(id, token);
      // navigate("/");
      toast.success(response?.message);
      thunkAPI.dispatch(getAllCategories());
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

const categorySlice = createSlice({
  name: "category",
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
    // Get all categories
    builder.addCase(getAllCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCategories.fulfilled, (state, actions) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.categories = actions.payload;
    });
    builder.addCase(getAllCategories.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Get a category by slug
    builder.addCase(getCategoryBySlug.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCategoryBySlug.fulfilled, (state, actions) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.category = actions.payload;
    });
    builder.addCase(getCategoryBySlug.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Create a new category
    builder.addCase(createCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createCategory.fulfilled, (state, actions) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.category = actions.payload;
    });
    builder.addCase(createCategory.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Update a category
    builder.addCase(updateCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCategory.fulfilled, (state, actions) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.category = actions.payload;
    });
    builder.addCase(updateCategory.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });

    // Delete a category
    builder.addCase(deleteCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteCategory.fulfilled, (state, actions) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.category = actions.payload;
    });
    builder.addCase(deleteCategory.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    });
  },
});

export const { clearState } = categorySlice.actions;

export default categorySlice.reducer;
