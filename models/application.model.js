const mongoose = require('mongoose');

// Create schema
const applicationSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'User',   // reference to User collection
    required: true
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',    // reference to Job collection
    required: true
  },

  appliedAt: {
    type: Date,
    default: Date.now   // auto current date
  }

});

// Create model
module.exports = mongoose.model('Application', applicationSchema);
