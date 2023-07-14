import axios from "axios";

import { RECIPE_URL, UPLOAD_URL } from "../../../constants/constants";

// *************************** Recipe *************************** //
// get all recipes
const getAllRecipes = async () => {
  const response = await axios.get(`${RECIPE_URL}`);
  return response.data;
};

// Get a recipe by id
const getSingleRecipe = async (recipeId) => {
  const response = await axios.get(`${RECIPE_URL}/${recipeId}`);
  return response.data;
};

// Create a recipe
const createRecipe = async (formData, token) => {
  const response = await axios.post(
    `${RECIPE_URL}`,
    { ...formData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Update a recipe image
const uploadRecipeImage = async (data, token) => {
  const response = await axios.post(`${UPLOAD_URL}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Save a recipe
const saveRecipe = async (recipeID, userID, token) => {
  const response = await axios.put(
    `${RECIPE_URL}/saveRecipe`,
    { recipeID, userID },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data?.savedRecipes;
};

// Unsave a recipe
const unsaveRecipe = async (recipeID, userID, token) => {
  const response = await axios.put(
    `${RECIPE_URL}/unsaveRecipe`,
    { recipeID, userID },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data?.savedRecipes;
};

// Get a recipe by ID
const getRecipeById = async (userID) => {
  const response = await axios.get(`${RECIPE_URL}/savedRecipes/${userID}`);
  return response.data;
};

// Get saved recipes
const getRecipesByUserId = async (userID, token) => {
  const response = await axios.get(`${RECIPE_URL}/savedRecipes/ids/${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data?.savedRecipes;
};

// Update a recipe
const updateRecipe = async (recipeID, formData, token) => {
  const response = await axios.put(`${RECIPE_URL}/${recipeID}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a recipe
const deleteRecipe = async (recipeID, token) => {
  const response = await axios.delete(`${RECIPE_URL}/${recipeID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Like a recipe
const likeRecipe = async (recipeID, token) => {
  const response = await axios.put(
    `${RECIPE_URL}/like`,
    { recipeID },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Unlike a recipe
const unlikeRecipe = async (recipeID, token) => {
  const response = await axios.put(
    `${RECIPE_URL}/unlike`,
    { recipeID },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// add a review
const addReview = async (recipeID, formData, token) => {
  const response = await axios.post(
    `${RECIPE_URL}/${recipeID}/reviews`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// delete a review
const deleteReview = async (recipeID, reviewID, token) => {
  const response = await axios.delete(
    `${RECIPE_URL}/reviews/${recipeID}/${reviewID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const recipeService = {
  getAllRecipes,
  createRecipe,
  getSingleRecipe,
  getRecipesByUserId,
  saveRecipe,
  unsaveRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadRecipeImage,
  likeRecipe,
  unlikeRecipe,
  addReview,
  deleteReview,
};

export default recipeService;
