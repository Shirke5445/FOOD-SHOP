import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

// Handle Uncaught exceptions
process.on('uncaughtException', (err) =>{
  console.log(`ERROR: ${err}`);
  console.log("Shuting down due to uncaught exception");
  process.exit(1);
});                                                         

dotenv.config({ path: "backend/config/config.env" });

// Connecting to database
connectDatabase()
  
app.use(express.json({ 
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString()
  },
}));
app.use(cookieParser());

// Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";


//import orderRoutes from "./routes/order.js";  //crash

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

//app.use("/api/v1", orderRoutes); //crash

//Using Error Middleware
app.use(errorMiddleware);


const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

//Handele unhandle Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROPR:${err}`);
  console.log(`Shutting down server deu to Unhandle Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
