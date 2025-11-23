const mongoose = require('mongoose');
const config = require('./env'); // load env variables
const logger = require('./logger'); // optional: for production logging

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      // useCreateIndex: true // deprecated in Mongoose 6+
    });
    console.log('✅ MongoDB connected successfully');
    logger.info('MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // exit process with failure
  }
};

// Optional: listen to DB connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB event: connected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB event: error', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB event: disconnected');
});

// Export the connect function
module.exports = connectDB;
