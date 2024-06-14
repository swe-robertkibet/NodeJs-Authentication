// MONGO DB
require('./config/db');

const express = require('express');
const app = express();
const port = 3000;

// Require the UserRouter module
const UserRouter = require('./api/user');

// TO ACCEPT FORM DATA
const bodyParser = express.json;
app.use(bodyParser());

// Use the UserRouter middleware
app.use('/user', UserRouter);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
