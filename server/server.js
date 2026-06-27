import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { specs } from "./config/swagger.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// // Enhanced CORS configuration
// const allowedOrigins = [
//   process.env.ADMIN_URL,
//   process.env.CLIENT_URL,
//   // Add production URLs
//    "https://babymart-admin-beta.vercel.app",  // admin 
//    "https://babymart-client-beta.vercel.app", // client 
//   "https://admin.babyshop.reactbd.com",
//   "https://babyshop.reactbd.com",
//   "https://babyshop-admin.netlify.app",

//   // Add localhost for development
//   "http://localhost:3000",
//   "http://localhost:5173",
// ].filter(Boolean); // Remove any undefined values
// console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: true ,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Increase body size limit for JSON and URL-encoded payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes); // 
app.use("/api/users", userRoutes);// 
app.use("/api/banners", bannerRoutes);// 
app.use("/api/products", productRoutes);// 
app.use("/api/categories", categoryRoutes);// 
app.use("/api/brands", brandRoutes);// 
app.use("/api/stats", statsRoutes); // 
app.use("/api/orders", orderRoutes);// 
app.use("/api/wishlist", wishlistRoutes); // 
app.use("/api/cart", cartRoutes);// 
app.use("/api/analytics", analyticsRoutes);
app.use("/api/performance", performanceRoutes);

// API Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "BabyShop API Documentation",
  })
);

// Home route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
  console.log(`API docs available at: http://localhost:${PORT}/api/docs`);
});
