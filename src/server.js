const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees');

require('dotenv').config();

const app = express();
app.use(express.json());

const SERVER_PORT = process.env.SERVER_PORT || 7777;

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Welcome to my WebApplication');
})

app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
});

