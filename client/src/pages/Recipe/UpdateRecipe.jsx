import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";

import {
  getSingleRecipe,
  updateRecipe,
} from "../../redux/feature/Recipe/recipeSlice";
import Editor from "../../components/Editor/Editor";
import BackLink from "../../components/BackLink/BackLink";
import Category from "../../components/RecipeForm/Category";
import RecipeName from "../../components/RecipeForm/RecipeName";
import Ingredients from "../../components/RecipeForm/Ingredients";
import CookingTime from "../../components/RecipeForm/CookingTime";
import RecipeButton from "../../components/RecipeForm/RecipeButton";
import UploadPicture from "../../components/RecipeForm/UploadPicture";

const UpdateRecipe = () => {
  const { recipeId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { recipe } = useSelector((state) => state.recipe);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = user?.token;

  const recipeData = {
    name: recipe?.name,
    ingredients: recipe?.ingredients,
    instructions: recipe?.instructions,
    image: recipe?.image,
    cookingTime: recipe?.cookingTime,
    category: { _id: "", name: "", image: "", slug: "" },
    owner: {
      _id: user?._id,
    },
  };

  const [data, setData] = useState(recipeData);
  const [uploading, setUploading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    dispatch(getSingleRecipe(recipeId));
  }, [dispatch, recipeId]);

  useEffect(() => {
    if (recipe) {
      setData(recipe);
    }
  }, [recipe]);

  // Handle change for all input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  // Click handler for adding ingredients
  const handleClick = (e) => {
    e.preventDefault();
    setData((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, inputValue],
    }));
    setInputValue("");
  };

  // Click handler for deleting ingredients
  const handleDelete = (ingredient) => {
    const newIngredients = data.ingredients.filter((ing) => ing !== ingredient);
    console.log(newIngredients);

    setData((prevRecipe) => ({
      ...prevRecipe,
      ingredients: newIngredients,
    }));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateRecipe({
        recipeID: recipeId,
        formData: data,
        token,
        toast,
        navigate,
      })
    );
    setData(recipeData);
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
      setData((prevRecipe) => ({
        ...prevRecipe,
        image: response.data.image,
      }));
      setUploading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setUploading(false);
    }
  };

  return (
    <div className='mt-12 mb-5'>
      <BackLink
        link={`/recipe-details/${recipeId}`}
        name='Back to recipe details'
      />
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
                <RecipeName recipe={data} handleChange={handleChange} />
                <Ingredients
                  recipe={data}
                  handleDelete={handleDelete}
                  handleClick={handleClick}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />

                <Editor recipe={data} handleChange={handleChange} />
                <CookingTime recipe={data} handleChange={handleChange} />
                <Category recipe={data} handleChange={handleChange} />
                <UploadPicture
                  handleUpload={handleUpload}
                  uploading={uploading}
                />
                {data.image ? (
                  <img
                    src={data?.image || "https://via.placeholder.com/150"}
                    alt=''
                    className='w-1/2 h-1/2'
                  />
                ) : (
                  <p>No image uploaded yet</p>
                )}
              </div>

              {/* <RecipeButton /> */}
              <RecipeButton title='Update' />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRecipe;
