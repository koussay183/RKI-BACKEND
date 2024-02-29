const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const superAdmin = mongoose.model('superadmin', superAdminSchema);

module.exports = superAdmin;