import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ChatBubbleLeftRightIcon,
  StarIcon,
  EyeIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";

import { subStringFunc } from "../../utils";
import {
  getSavedRecipes,
  likeRecipe,
  unlikeRecipe,
} from "../../redux/feature/Recipe/recipeSlice";
 
const BLogCard = ({ recipe }) => {
  const { user } = useSelector((state) => state.auth);
  const { savedRecipes } = useSelector((state) => state.recipe);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const token = user?.token;
  const userID = user?._id;
  console.log(userID);
  console.log(recipe?.likes.length);

  const recipesIDs = savedRecipes?.map((recipe) => recipe._id);

  useEffect(() => {
    if (token) dispatch(getSavedRecipes({ userID, token }));
  }, [dispatch, userID, token, user]);

  // Like Recipe
  const handleLike = async (id) => {
    dispatch(likeRecipe({ recipeID: id, token }));
    console.log("like", id);
  };

  // Unlike Recipe
  const handleUnlike = async (id) => {
    dispatch(unlikeRecipe({ recipeID: id, token }));
    console.log("unlike", id);
  };

  return (
    <Card className='w-full max-w-[26rem] shadow-lg' key={recipe?._id}>
      {/* CardHeader */}
      <CardHeader floated={false} color='blue-gray'>
        <img
          src={recipe?.image}
          alt={recipe?.name}
          className='object-cover w-full h-48 rounded-t-lg'
        />

        {/* Background Gradient */}
        <div className='to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 ' />

        {/* Like & Unlike */}
        {!user ? (
          <Tooltip content='Login to like this recipe'>
            <IconButton
              size='sm'
              color='white'
              variant='text'
              className='!absolute top-4 right-4 rounded-full'
            >
              <HandThumbUpIcon className='h-5 w-5' />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            size='sm'
            color='white'
            variant='text'
            className='!absolute top-4 right-4 rounded-full'
          >
            {recipe?.likes?.includes(userID) ? (
              <HandThumbUpIcon
                onClick={() => handleUnlike(recipe?._id)}
                className='h-5 w-5'
                fill='white'
              />
            ) : (
              <HandThumbUpIcon
                onClick={() => handleLike(recipe?._id)}
                className='h-5 w-5'
              />
            )}
          </IconButton>
        )}
      </CardHeader>

      {/* CardBody */}
      <CardBody>
        <div className='mb-3 flex items-center justify-between'>
          <Typography variant='h5' color='blue-gray' className='font-medium'>
            <Link to={`/recipe-details/${recipe?._id}`}>{recipe?.name}</Link>
          </Typography>

          {recipesIDs?.includes(recipe._id) ? (
            <Chip variant='ghost' color='green' size='sm' value='Saved' />
          ) : (
            <Chip variant='ghost' size='sm' color='red' value='Not Saved' />
          )}
        </div>

        <Typography color='gray'>
          <span
            dangerouslySetInnerHTML={{
              __html: subStringFunc(recipe?.instructions, 40),
            }}
          />
        </Typography>

        {/* Icons */}
        <div className='group mt-8 flex justify-around items-center'>
          <Tooltip
            content={`${recipe?.rating} ${
              recipe?.rating === 1 ? "star" : "stars"
            }`}
          >
            <StarIcon className='h-5 w-5' />
          </Tooltip>
          <Tooltip
            content={`${recipe?.views} ${
              recipe?.views === 1 ? "view" : "views"
            }`}
          >
            <EyeIcon className='h-5 w-5' />
          </Tooltip>
          <Tooltip
            content={`${recipe?.reviews?.length} ${
              recipe?.reviews?.length === 1 ? "reviews" : "review"
            }`}
          >
            <ChatBubbleLeftRightIcon className='h-5 w-5' />
          </Tooltip>
          <Tooltip
            content={`${recipe?.likes?.length} ${
              recipe?.likes?.length === 1 ? "like" : "likes"
            }`}
          >
            <HandThumbUpIcon className='h-5 w-5' />
          </Tooltip>
        </div>
      </CardBody>

      {/* CardFooter */}
      <CardFooter className='pt-3'>
        <Button
          onClick={() => navigate(`/recipe-details/${recipe?._id}`)}
          size='lg'
          fullWidth={true}
          className='bg-teal-400'
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BLogCard;
