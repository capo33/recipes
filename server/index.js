import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();

import connectToDB from "./config/db.js";
import authRoutes from "./routes/Auth.routes.js";
import uploadRoutes from "./routes/Upload.routes.js";
import recipeRoutes from "./routes/Recipe.routes.js";
import categoryRoutes from "./routes/Category.routes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Initialize express
const app = express();

// Set port
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectToDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/upload", uploadRoutes);

// dirname is not available when using ES modules, we set __dirname to current directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Make uploads folder static
if (process.env.NODE_ENV === "production") {
  app.use("/uploads", express.static("/var/data/uploads"));
  app.use(express.static(path.join(__dirname, "/client/build")));

  // for any route that is not api, redirect to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  // Welcome route
  app.get("/", (req, res) => {
    res.json({
      message: "API is running...",
      path: path.join(__dirname, "/uploads"),
    });
  });
}

// Error middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
