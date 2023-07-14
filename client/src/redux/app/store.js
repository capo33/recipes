import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../feature/Auth/authSlice";
import recipeReducer from "../feature/Recipe/recipeSlice";
import categoryReducer from "../feature/Category/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipe: recipeReducer,
    category: categoryReducer,  },
});
