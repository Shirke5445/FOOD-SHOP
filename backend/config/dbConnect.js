import mongoose from "mongoose";

export const connectDatabase = () => {
  let DB_URI;

  // Check if NODE_ENV is DEVELOPMENT or PRODUCTION
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    DB_URI = process.env.DB_LOCAL_URI;
  } else if (process.env.NODE_ENV === "PRODUCTION") {
    DB_URI = process.env.DB_URI;
  } else {
    throw new Error("NODE_ENV is not set correctly.");
  }

  if (!DB_URI) {
    throw new Error("DB_URI is not defined.");
  }

  mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((con) => {
      console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    })
    .catch((err) => {
      console.error(`Failed to connect to MongoDB: ${err.message}`);
      process.exit(1); // Exit process if connection fails
    });
};
