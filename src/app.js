const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// const authRoutes = require('./routes/authRoutes');
// const linkRoutes = require('./routes/linkRoutes');
// const analyticsRoutes = require('./routes/analyticsRoutes');
// const { errorHandler } = require('./middlewares/errorHandler');
const config = require('./config/env');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiter
const limiter = rateLimit({
  windowMs: config.rateLimitWindow * 60 * 1000,
  max: config.rateLimitMax
});
app.use(limiter);

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/links', linkRoutes);
// app.use('/api/analytics', analyticsRoutes);

// Error Handler (Central)
// app.use(errorHandler);

module.exports = app;
