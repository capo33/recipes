import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

import "react-quill/dist/quill.snow.css";

import Category from "../../components/RecipeForm/Category";
import RecipeName from "../../components/RecipeForm/RecipeName";
import { userProfile } from "../../redux/feature/Auth/authSlice";
import CookingTime from "../../components/RecipeForm/CookingTime";
import Ingredients from "../../components/RecipeForm/Ingredients";
// import Instructions from "../../components/RecipeForm/Instructions";
import RecipeButton from "../../components/RecipeForm/RecipeButton";
import { createRecipe } from "../../redux/feature/Recipe/recipeSlice";
import UploadPicture from "../../components/RecipeForm/UploadPicture";
import { getAllCategories } from "../../redux/feature/Category/categorySlice";
import Editor from "../../components/Editor/Editor";

const AddRecipe = () => {
  const { user } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    image: "",
    cookingTime: 0,
    category: { _id: "", name: "", image: "", slug: "" },

    owner: {
      _id: user?._id,
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = user?.token;

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch, token]);

  // Get user profile
  useEffect(() => {
    dispatch(userProfile(token));
  }, [dispatch, token]);

  // Click handler for adding ingredients
  const handleClick = (e) => {
    e.preventDefault();
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, inputValue],
    }));
    setInputValue("");
  };

  // Click handler for deleting ingredients
  const handleDelete = (ingredient) => {
    const newIngredients = recipe.ingredients.filter(
      (ing) => ing !== ingredient
    );
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  // Change handler for input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  // Submit handler for form
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createRecipe({ formData: recipe, token }));
    navigate("/");
    setRecipe({
      name: "",
      ingredients: [],
      instructions: "",
      image: "",
      cookingTime: 0,
      category: { _id: "", name: "", image: "", slug: "" },
      owner: {
        _id: user?._id,
      },
    });
  };

  // Upload image handler
  const handleUpload = async (e) => {
    const file = e?.target?.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axios.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setRecipe({ ...recipe, image: response.data.image });
      setUploading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setUploading(false);
    }
  };

  return (
    <div className='mt-12 mb-5'>
      <div className='md:grid md:grid-cols-3 md:gap-6'>
        <div className='md:col-span-1'>
          <div className='px-4 sm:px-0'>
            <h3 className='p-5 text-lg font-medium leading-6 text-gray-900'>
              Create your recipe and share it to the world!
            </h3>
            <p className='px-5 text-sm text-gray-600'>
              "Cooking is like painting or writing a song. Just as there are
              only so many notes or colors, there are only so many flavors—it’s
              how you combine them that sets you apart."
            </p>
          </div>
        </div>
        <div className='mt-5 md:mt-0 md:col-span-2'>
          <form onSubmit={handleSubmit}>
            <div className='shadow sm:rounded-md sm:overflow-hidden'>
              <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                <RecipeName recipe={recipe} handleChange={handleChange} />
                <Ingredients
                  recipe={recipe}
                  handleDelete={handleDelete}
                  handleClick={handleClick}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                {/* <Instructions recipe={recipe} handleChange={handleChange} /> */}
                <Editor
                  recipe={recipe}
                  onChange={(value) =>
                    setRecipe({ ...recipe, instructions: value })
                  }
                />
                <CookingTime recipe={recipe} handleChange={handleChange} />
                <Category recipe={recipe} handleChange={handleChange} />
                <UploadPicture
                  handleUpload={handleUpload}
                  uploading={uploading}
                />
              </div>
              <RecipeButton title='Add recipe' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
