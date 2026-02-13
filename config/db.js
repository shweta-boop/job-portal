const mongoose = require('mongoose');

// function to connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb://127.0.0.1:27017/SmartJob' // DB name
    );

    console.log('MongoDB connected');

  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;  
