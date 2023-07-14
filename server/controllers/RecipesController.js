import UserModel from "../models/User.js";
import RecipeModel from "../models/Recipes.js";
import CategoryModel from "../models/Category.js";

// @desc Get all recipes
// @route GET /api/recipes
// @access Public
const getRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find({})
      .populate("owner", "name avatar")
      .populate("category", "name image");

    res.status(200).json(recipes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Create a recipe
// @route POST /api/recipes
// @access Public
const createRecipe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newRecipe = await RecipeModel.create({
      ...req.body,
      owner: req.user._id, // we add  rOwner to the recipe object so we can populate the userOwner field when we fetch the recipe
    });

    await CategoryModel.findByIdAndUpdate(req.body.category, {
      $push: { recipes: newRecipe._id },
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//@desc     GET a recipe by id
//@route    GET /api/v1/recipes/:id
//@access   Public

const getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await RecipeModel.findById(recipeId)
      .populate("owner", "-password")
      .populate("category", "name image");

    const views = recipe?.views || 0;
    recipe?.set({ views: views + 1 });
    await recipe?.save();

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//@desc     Update a recipe
//@route    PUT /api/v1/recipes/:id
//@access   Private
const updateRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user is the owner of the recipe
    if (recipe?.owner.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      recipeId,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      updatedRecipe,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Save a recipe
// @route PUT /api/recipes
// @access Public
const saveRecipe = async (req, res) => {
  //   const recipe = await RecipeModel.findById(req.body.recipeID);
  //   const user = await UserModel.findById(req.body.userID);

  //   try {
  //     // we need to add the recipe to the user's savedRecipes array so we are pushing the recipe object into the user's savedRecipes array
  //     user.savedRecipes.push(recipe);
  //     await user.save();
  //     res.status(201).json({ savedRecipes: user.savedRecipes });
  //   } catch (error) {
  //     res.status(409).json({ message: error.message });
  //   }
  // };
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recipe = await RecipeModel.findById(req.body.recipeID).populate(
      "category",
      "name image recipes"
    );

    const user = await UserModel.findById(req.body.userID);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user is the owner of the recipe
    // if (recipe.owner.toString() === req?.user?._id.toString()) {
    //   res.status(401);
    //   throw new Error("You cannot save your own recipe");
    // }

    // Check if the recipe is already saved
    const isSaved = user?.savedRecipes.includes(recipe._id);
    if (isSaved) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    // Save the recipe
    await UserModel.findByIdAndUpdate(
      req.body.userID,
      {
        $push: { savedRecipes: recipe._id },
      },
      { new: true } // to return the updated document
    );

    // user?.savedRecipes.push(recipe._id);

    // await user?.save();

    res.status(200).json({
      success: true,
      message: "Recipe saved successfully",
      savedRecipes: user?.savedRecipes,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Unsave a recipe
// @route   PUT /api/v1/recipes/:id/unsave
// @access  Private
const unsaveRecipe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const recipe = await RecipeModel.findById(req.body.recipeID).populate(
      "category",
      "name"
    );
    const user = await UserModel.findById(req.body.userID);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the recipe is already saved
    const isUnsaved = user?.savedRecipes.includes(recipe._id);

    if (!isUnsaved) {
      return res.status(400).json({ message: "Recipe not saved" });
    }

    // Unsave the recipe
    await UserModel.findByIdAndUpdate(
      req.body.userID,
      {
        $pull: { savedRecipes: recipe._id },
      },
      { new: true } // to return the updated document
    );

    res.status(200).json({
      success: true,
      message: "Recipe unsaved successfully",
      savedRecipes: user?.savedRecipes,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get recipes by user
// @route   GET /api/v1/recipes/savedRecipes/:userId
// @access  Public
const getRecipesByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id)
      .populate("savedRecipes")
      .select("-password");
    res.status(201).json(user?.savedRecipes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get saved recipes
// @route   GET /api/v1/recipes/savedRecipes/ids/:id
// @access  Private
const getSavedRecipes = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id)
      .populate("savedRecipes")
      .select("-password");

    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes }, // $in means that we are looking for the recipes that are in the user's savedRecipes array
    })
      .populate("category", "name image")
      .populate("owner", "name");

    res.status(201).json({ savedRecipes });
    // const savedRecipes = await RecipeModel.find({
    //   $where: function () {
    //     return this._id in user.savedRecipes;
    //   },
    // });
    // we need to find the recipes that are in the user's savedRecipes array so we are using the $in operator
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/v1/recipes/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { id } = req.params; // recipe id

    // we need to get the rating and comment because we are going to send a number rating and a comment
    const { rating, comment } = req.body;

    const recipe = await RecipeModel.findById(id)
      .sort({ createdAt: -1 })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name email",
        },
      });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user already reviewed the recipe before, so we match the review user with the logged in user
    const alreadyReviewed = recipe.reviews.find(
      (review) => review?.user?.toString() === req.user?._id.toString()
    );

    // if (alreadyReviewed) {
    //   return res.status(400).json({ message: "Recipe already reviewed" });
    // }

    // if the user has not reviewed the recipe before, we create a new review object
    const review = {
      name: req.user?.name,
      rating: Number(rating),
      comment: comment,
      user: req.user?._id,
    };

    // we push the new review to the recipe reviews array
    recipe.reviews.push(review);

    // we update the number of reviews and the rating
    recipe.numReviews = recipe.reviews.length;

    // we update/calculate the rating the rating by getting the sum of all the ratings and dividing it by the number of reviews
    recipe.rating =
      recipe?.reviews?.reduce((acc, item) => Number(item?.rating) + acc, 0) /
      recipe?.reviews?.length;

    // we save the recipe
    await recipe.save();

    res.status(201).json({ recipe, message: "Review added" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/v1/recipes/reviews/:recipeId/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const { recipeId, reviewId } = req.params; // recipe id and review id

    const recipe = await RecipeModel.findByIdAndUpdate(
      recipeId,
      {
        $pull: { reviews: { _id: reviewId } },
      },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // we update the number of reviews and the rating
    recipe.numReviews = recipe.reviews.length;

    // we update/calculate the rating the rating by getting the sum of all the ratings and dividing it by the number of reviews
    recipe.rating =
      recipe?.reviews?.reduce((acc, item) => Number(item?.rating) + acc, 0) /
      recipe?.reviews?.length;

    // we save the recipe
    await recipe.save();

    res.status(200).json({ recipe, message: "Review deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Like a recipe
// @route   PUT /api/v1/recipes/like
// @access  Private
const likeRecipe = async (req, res) => {
  try {
    const { recipeID } = req.body;
    const recipe = await RecipeModel.findByIdAndUpdate(
      recipeID,
      {
        $addToSet: { likes: req.user?._id }, // $addToSet adds the user id to the likes array if it is not already there
      },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ recipe, message: "Recipe liked" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Unlike a recipe
// @route   PUT /api/v1/recipes/unlike
// @access  Private
const unlikeRecipe = async (req, res) => {
  try {
    const { recipeID } = req.body;
    const recipe = await RecipeModel.findByIdAndUpdate(
      recipeID,
      {
        $pull: { likes: req.user?._id }, // $pull removes the user id from the likes array
      },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ recipe, message: "Recipe unliked" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Delete a recipe
// @route DELETE /api/recipes/:id
// @access private
const deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user is the owner of the recipe
    if (recipe?.owner.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await RecipeModel.findByIdAndDelete(recipeId);

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  getRecipesByUser,
  addReview,
  deleteReview,
  likeRecipe,
  unlikeRecipe,
};
