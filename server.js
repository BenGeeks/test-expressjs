const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./router');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.set('strictQuery', true);
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`The backend server is running on port: ${port}`);
});
