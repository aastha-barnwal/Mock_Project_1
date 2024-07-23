// express server
const express = require('express');
// database
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const session = require('express-session');
const querystring =require('querystring');
// const apiRoutes = require('./routes/router');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET=process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

dotenv.config();

const app = express();
app.use(express.json());
// parses the json object 
// app.use(bodyParser.json());
// app.use(session({
//     secret: 'secret_key',
//     resave:false,
//     saveUninitialized:true
// }))

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});


app.use('/auth', routes);



mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// app.use('/', apiRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
