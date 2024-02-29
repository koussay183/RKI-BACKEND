const mongoose = require('mongoose');

const op = new mongoose.Schema({
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

const Op = mongoose.model('op', op);

module.exports = Op;