import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  TrashIcon,
  PencilSquareIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  Rating,
  Tooltip,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { toast } from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addReview,
  deleteRecipe,
  deleteReview,
  getSavedRecipes,
  getSingleRecipe,
  saveRecipe,
  unsaveRecipe,
} from "../../redux/feature/Recipe/recipeSlice";
import Modal from "../../components/Modal/Modal";
import BackLink from "../../components/BackLink/BackLink";

const RecipeDetails = () => {
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { recipe } = useSelector((state) => state.recipe);
  const { savedRecipes } = useSelector((state) => state.recipe);

  const [show, setShow] = React.useState(false);
  const [data, setData] = useState({
    rating: 0,
    comment: "",
  });

  const userID = user?._id;
  const token = user?.token;
  const recipe_Id = recipe?._id;
  const guestID = recipe?.owner?._id;
  const recipesIDs = savedRecipes?.map((recipe) => recipe._id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSingleRecipe(id));
    if (token) {
      dispatch(getSavedRecipes({ userID, token }));
    }
  }, [dispatch, id, token, userID]);

  // Delete handler for recipe
  const handleDeleteBlog = async () => {
    dispatch(
      deleteRecipe({
        recipeID: recipe?._id,
        token,
        navigate,
        toast,
      })
    );
  };

  // Delete handler for recipe
  const handleConfirmDelete = () => {
    setShowModal((prev) => !prev);
  };

  // Save Recipe
  const handleSaveRecipe = (recipeID) => {
    dispatch(
      saveRecipe({
        recipeID,
        userID,
        token,
      })
    );
  };

  // Unsave Recipe
  const handleUnsaveRecipe = (recipeID) => {
    dispatch(
      unsaveRecipe({
        recipeID,
        userID,
        token,
      })
    );
  };

  // Submit handler for review
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addReview({
        recipeID: recipe?._id,
        formData: data,
        token,
        toast,
      })
    );
    setData({
      rating: 0,
      comment: "",
    });
  };

  //  Show and hide comments
  const toggleComment = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const handleDeleteComment = (recipeID, reviewID) => {
    dispatch(
      deleteReview({
        recipeID: recipe_Id,
        reviewID,
        token,
        toast,
      })
    );
  };

  // Ingredients list
  const listOfIngredients = recipe?.ingredients?.map((ingredient) => (
    <div
      className='flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4 border-l-teal-300 bg-gradient-to-r from-teal-100 to-transparent hover:from-teal-200'
      key={ingredient}
    >
      {ingredient}
    </div>
  ));

  // Tabs data
  const tabData = [
    {
      label: "Ingredients",
      value: "ingredients",
      icon: ClipboardDocumentListIcon,
      desc: listOfIngredients ? listOfIngredients : "No Ingredients",
    },
    {
      label: "Instructions",
      value: "instructions",
      icon: ClipboardDocumentCheckIcon,
      desc: recipe?.instructions ? recipe?.instructions : "No Instructions",
    },
  ];

  return (
    <>
      <div className='container px-6 py-10 mx-auto max-w-screen-lg'>
        <BackLink link='/' name='Back to Home' />

        {showModal ? (
          <>
            <Modal
              setShowModal={setShowModal}
              handleDelete={handleDeleteBlog}
              value='recipe'
            />
          </>
        ) : null}

        {/* Recipe contents*/}
        <div className='mt-10'>
          <div className='mb-4 md:mb-0 w-full mx-auto relative'>
            <div className='px-4 lg:px-0'>
              <h2 className='text-4xl font-semibold text-gray-800 leading-tight'>
                {recipe?.name}
              </h2>
              {recipe?.category?.name ? (
                <Link
                  to={`/category/${recipe?.category?.name}`}
                  className='py-2 text-green-700 inline-flex items-center justify-center mb-2'
                >
                  {recipe?.category?.name}
                </Link>
              ) : (
                "No Category"
              )}
            </div>
            <img
              src={recipe?.image}
              alt={recipe?.name}
              className='w-full h-full object-cover rounded'
              style={{ height: "28em" }}
            />
          </div>

          {/* Recipe Details */}
          <div className='flex flex-col lg:flex-row lg:space-x-12'>
            <div className='px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed w-full lg:w-3/4'>
              <Tabs value='ingredients'>
                <TabsHeader>
                  {tabData.map(({ label, value, icon }) => (
                    <Tab key={value} value={value}>
                      <div className='flex items-center gap-2'>
                        {React.createElement(icon, { className: "w-5 h-5" })}
                        {label}
                      </div>
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody>
                  {tabData.map(({ value, desc, label }) => (
                    <TabPanel
                      key={value}
                      value={value}
                      className={`${
                        value === "instructions"
                          ? "border-l-4 border-teal-500 pl-4 m-4 italic rounded text-gray-700  "
                          : " "
                      }`}
                    >
                      {value === "instructions" ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: desc,
                          }}
                        />
                      ) : (
                        <div>{desc}</div>
                      )}
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            </div>

            {/* Recipe Owner */}
            <div className='w-full lg:w-1/4 m-auto mt-12 max-w-screen-sm'>
              <div className='p-4 border-t border-b md:border md:rounded'>
                <Link
                  to={
                    recipe?.owner?._id !== userID
                      ? `/user-profile/${guestID}`
                      : "/profile"
                  }
                >
                  <div className='flex py-2'>
                    <img
                      src={recipe?.owner?.image}
                      alt={recipe?.owner?.name}
                      className='h-10 w-10 rounded-full mr-2 object-cover'
                    />
                    <div>
                      <p className='font-semibold text-gray-700 text-sm'>
                        {recipe?.owner?.name}
                      </p>
                      <p className='font-semibold text-gray-600 text-xs'>
                        {recipe?.owner?.email}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Save Recipe */}
                <div>
                  {!user ? (
                    <Tooltip content='Login to save recipe'>
                      <BookmarkIcon className='h-5 w-5' />
                    </Tooltip>
                  ) : (
                    <>
                      {recipesIDs?.includes(recipe?._id) ? (
                        <div
                          className={`px-2 py-1 flex w-full items-center justify-center gap-2 rounded-md bg-gray-700 text-gray-100 cursor-pointer
                            `}
                          onClick={() => handleUnsaveRecipe(recipe?._id)}
                        >
                          <BookmarkSlashIcon className='h-5 w-5 cursor-pointer' />
                          <span className='badge rounded-pill'>Unsave</span>
                        </div>
                      ) : (
                        <div
                          className={`px-2 py-1 flex w-full items-center justify-center gap-2 rounded-md bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-200
                            `}
                          onClick={() => handleSaveRecipe(recipe?._id)}
                        >
                          <BookmarkIcon className='h-5 w-5 cursor-pointer' />
                          <span className=' '>Save</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
                    {recipe?.owner?._id === userID && (
              <div className='p-4 border-t border-b md:border md:rounded mt-10 bg-blue-gray-50'>
                <div className='flex justify-around '>
                  <div className='flex items-center'>
                      <>
                        <Link
                          to={`/update-recipe/${recipe?._id}`}
                          className='flex items-center text-blue-700 hover:text-blue-900 focus:outline-none'
                        >
                          <PencilSquareIcon className='h-5 w-5 mr-1' />
                          <span className='text-sm'>Edit</span>
                        </Link>

                        <button
                          onClick={handleConfirmDelete}
                          className='flex items-center text-deep-orange-700 hover:text-deep-orange-900 ml-6 focus:outline-none'
                        >
                          <TrashIcon className='h-5 w-5 mr-1' />
                          <span className='text-sm'>Delete</span>
                        </button>
                      </>
                  </div>
                </div>
              </div>
                    )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className='pt-12'>
          <Typography
            variant='h5'
            className=' text-gray-800 font-semibold mb-6 '
          >
            Reviews
          </Typography>

          {recipe?.reviews && recipe?.reviews?.length === 0 && (
            <Typography
              variant='h6'
              className='mt-6 text-gray-400 flex justify-center items-center'
            >
              No reviews yet
            </Typography>
          )}

          {/* Show and Hide */}
          {recipe?.reviews && recipe?.reviews?.length > 2 && (
            <>
              <div className=''>
                {show ? (
                  <h6 className='mb-6' onClick={() => toggleComment()}>
                    <span className='cursor-pointer underline rounded '>
                      Hide Comments
                    </span>
                  </h6>
                ) : (
                  <h6 className='mb-6' onClick={() => toggleComment()}>
                    <span className='cursor-pointer underline rounded'>
                      {recipe?.reviews?.length > 0
                        ? "Show Latest"
                        : "No Comments Yet"}
                    </span>
                  </h6>
                )}
              </div>
            </>
          )}

          {/* Show 3 Reviews */}
          <div className='grid gap-6 md:grid-cols-2 grid-cols-1 lg:gap-12'>
            {recipe?.reviews && recipe?.reviews?.length > 0 && !show && (
              <>
                {recipe?.reviews
                  ?.map((review) => (
                    <>
                      <div className='mb-12 p-5 md:mb-0 shadow-xl'>
                        <div className='justify-between flex-wrap flex'>
                          <h5 className='mb-4 text-xl  font-semibold'>
                            {review?.name}
                          </h5>

                          {review?.user === user?._id && (
                            <button
                              className='flex text-deep-orange-700 hover:text-deep-orang'
                              onClick={() =>
                                handleDeleteComment(recipe_Id, review._id)
                              }
                            >
                              <TrashIcon className='h-5 w-5 mr-1' />
                              <span className='text-sm'>Delete</span>
                            </button>
                          )}
                        </div>
                        <p className='mb-4'>{review?.comment}</p>
                        <Rating value={review?.rating} />
                      </div>
                    </>
                  ))
                  .slice(0, 2)}
              </>
            )}

            {/* Show All Reviews */}
            {show && recipe?.reviews && recipe?.reviews?.length > 0 && (
              <>
                {recipe?.reviews.map((review) => (
                  <>
                    <div className='mb-12 p-5  md:mb-0 shadow-xl'>
                      <div className='justify-between flex-wrap flex'>
                        <h5 className='mb-4 text-xl font-semibold'>
                          {review?.name}
                        </h5>

                        {review?.user === user?._id && (
                          <button
                            className='flex text-deep-orange-700 hover:text-deep-orang'
                            onClick={() =>
                              handleDeleteComment(recipe_Id, review._id)
                            }
                          >
                            <TrashIcon className='h-5 w-5 mr-1' />
                            <span className='text-sm'>Delete</span>
                          </button>
                        )}
                      </div>
                      <p className='mb-4'>{review?.comment}</p>
                      <Rating value={review?.rating} />

                      <div className='text-xs dark:text-gray-400'>
                        {moment(review?.createdAt).fromNow()}
                      </div>
                    </div>
                  </>
                ))}
              </>
            )}
          </div>

          {/* Add Review */}
          <form
            className='mt-12 max-w-2xl shadow-xl rounded-lg p-6 g'
            onSubmit={handleSubmit}
          >
            <div className='px-3 mb-2 mt-2'>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <select
                  className='w-full bg-gray-100 rounded border border-gray-400 leading-normal resize-none h-10 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white'
                  value={data.rating}
                  onChange={(e) =>
                    setData({
                      ...data,
                      rating: e.target.value,
                    })
                  }
                >
                  <option value=''>Select Rating</option>
                  <option value='1'>1 - Unacceptable</option>
                  <option value='2'>2 - Needs Improvement</option>
                  <option value='3'>3 - Decent</option>
                  <option value='4'>4 - Good</option>
                  <option value='5'>5 - Very tasty</option>
                </select>
              </div>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <textarea
                  placeholder='comment'
                  value={data.comment}
                  onChange={(e) =>
                    setData({ ...data, comment: e.target.value })
                  }
                  className='w-full bg-gray-100 rounded border border-gray-400 leading-normal resize-none h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white'
                ></textarea>
              </div>
            </div>
            <div className='flex justify-end px-4'>
              <button
                type='submit'
                disabled={user ? false : true}
                className='bg-black text-white px-4 py-2 rounded mr-2'
              >
                Add Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RecipeDetails;
