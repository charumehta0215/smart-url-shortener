import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/env.js";

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
