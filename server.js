const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express();


//Import Routes
const otpRoutes = require('./routes/auth')

//Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


//Use routes as middleware
app.use('/api', otpRoutes);


//DB Server Connection
mongoose.connect(process.env.DATABASE, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true
    })
    .then(() => console.log('Connected to DB'))
    .catch(err => {
        console.log(err);
    });

// Listening Port
const Port = process.env.PORT || 8000;
app.listen(Port, () => console.log(`Listening on port ${Port}`))
