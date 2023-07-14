import bcrypt from "bcrypt";

import UserModel from "../models/User.js";
import RecipeModel from "../models/Recipes.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password, answer } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Check the length of the password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    // Check if fields are empty
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      answer,
    });

    const token = generateToken(newUser._id);

    // Take out password from response
    const { password: _, ...savedUser } = newUser._doc;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      ...savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    // Check if password matches
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(existingUser._id);

    // Take out password from response
    const { password: _, ...userWithoutPassword } = existingUser._doc;
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      ...userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Logout a user
// @route   GET /api/v1/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // get user from req.user
    const user = await UserModel.findById(req.user?._id).select("-password");
    const recipe = await RecipeModel.find({ owner: req.user?._id }).populate(
      "owner",
      "-password"
    );

    user?.set({ recipes: recipe });
    // check user existince
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // generate token
    const token = generateToken(user?._id);

    // Remove password
    const { password: _, ...savedUser } = user?._doc;

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      token,
      ...savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public

const forgotPassword = async (req, res) => {
  const { email, answer, newPassword } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ msg: "Email does not exist" });
    }

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ msg: "Please provide an email" });
    }

    // Check if answer is provided
    if (!answer) {
      return res.status(400).json({ msg: "Please provide an answer" });
    }

    // Check if newPassword is provided
    if (existingUser.answer !== answer) {
      return res.status(400).json({ msg: "Answer is incorrect" });
    }

    // Check if newPassword is empty
    if (!newPassword) {
      return res.status(400).json({ msg: "Please provide a new password" });
    }

    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    const user = await UserModel.findByIdAndUpdate(existingUser._id, {
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/update
// @access  Private
const updateProfile = async (req, res) => {
  try {
    // Check if user exists
    const user = await UserModel.findById(req.user?._id); // req.user?._id is set by the auth middleware

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user?._id,
      { ...req.body },
      { new: true }
    );
    // Create token
    const token = generateToken(updatedUser?._id);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/auth/user/:id
// @access  Private/Admin or User
const deleteUserByUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user?._id);
    const recipes = await RecipeModel.findOneAndDelete({
      owner: req.user?._id,
    });
    // Check if user exists with the given id
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user is authorized to delete the user
    if (user._id.toString() !== req.user?._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete user
    await user.deleteOne();
    await recipes.deleteOne();
    res.status(200).json({
      success: true,
      message: "Sad to see you go, user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/auth/user/:id
// @access  Private/Admin
const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    // Check if user exists with the given id
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user is authorized to delete the user
    if (
      user?._id.toString() !== req.user?._id.toString() &&
      user.role === "admin"
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "All users",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a user's profile
// @route   GET /api/v1/auth/user/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get user's recipes
    const recipes = await RecipeModel.find({ owner: req.params.id });

    res.status(200).json({ user, recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  updateProfile,
  deleteUserByUser,
  deleteUserByAdmin,
  getUsers,
  getUserProfile,
};
