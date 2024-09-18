import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`ERROR: ${err.message}`);
  console.error("Shutting down due to uncaught exception");
  process.exit(1);
});

const app = express();

// Load environment variables
dotenv.config({ path: "backend/config/config.env" });

// Log the environment variables for debugging purposes
console.log("Environment Variables:");
console.log(`PORT: ${process.env.PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`DB_LOCAL_URI: ${process.env.DB_LOCAL_URI}`);
console.log(`DB_URI: ${process.env.DB_URI}`);

// Connecting to database
connectDatabase();

app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));
app.use(cookieParser());

// Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

// Set up API routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// Using Error Middleware
app.use(errorMiddleware);

// Start the server
const server = app.listen(process.env.PORT || 4000, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT || 4000} in ${process.env.NODE_ENV || 'DEVELOPMENT'} mode.`
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error(`ERROR: ${err.message}`);
  console.error("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
