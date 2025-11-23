const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/env');

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
