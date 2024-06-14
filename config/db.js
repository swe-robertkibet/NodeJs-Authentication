require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_KEY)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => console.log(err));
