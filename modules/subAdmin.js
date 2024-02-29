const mongoose = require('mongoose');

const subAdminSchema = new mongoose.Schema({
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
  },
  compNumber : {
    type : Number ,
    enum : [1 , 2 , 3],
    required : true
  }
});

const subAdmin = mongoose.model('subadmin', subAdminSchema);

module.exports = subAdmin;