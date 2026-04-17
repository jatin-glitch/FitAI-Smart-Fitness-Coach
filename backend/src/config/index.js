require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fitai',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;
