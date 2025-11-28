import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/env.js";
import logger from "./config/logger.js";

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });
};

startServer();
