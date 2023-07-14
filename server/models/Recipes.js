import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: [true, "Please enter your instructions"],
    },
    ingredients: {
      type: [String],
      required: [true, "Please enter your ingredients"],
    },
    image: {
      type: String,
    },
    cookingTime: {
      type: Number,
      required: [true, "Please enter your cooking time"],
      default: 0,
    },
    views: {
      type: Number,
      required: [true, "Please enter your views"],
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },

    slug: {
      type: String,
      lowercase: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
