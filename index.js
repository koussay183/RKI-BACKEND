const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const subadminRoutes = require('./routes/subadminRoutes');
const opRoutes = require('./routes/opRoutes');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Use middleware for each user role
app.use('/admin', adminRoutes);
app.use('/subadmin', subadminRoutes);
app.use('/op', opRoutes);

// Start the server
app.listen(3000, () => {
    // Connect to MongoDB 
    mongoose.connect('', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName : "RTK"
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
    console.log('Server is running on port 3000');
});
