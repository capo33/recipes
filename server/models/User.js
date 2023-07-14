import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: [true, "Please enter your answer"],
    },
    image: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
    },
    about: {
      type: String,
      default: "No bio yet",
    },
    role: {
      type: String,
      default: "user",
    },
    savedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    phone: {
      type: String,
      default: "No phone number yet",
    },
    address: {
      type: String,
      default: "No address yet",
    },
    birthday: {
      type: Date,
      default: Date.now,
    },
    interests: {
      type: Array,
      default: ["No interests yet"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
