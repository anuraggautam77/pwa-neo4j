/*
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const historyApiFallback = require('connect-history-api-fallback');
const path = require('path');
const cors = require('cors');

/*
 * connect middleware - please note not all the following are needed for the specifics of this example but are generally used.
 */
const app = express();
const apiRoutes = express.Router();
const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 5300;

const server = app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});



app.use(cors());
app.options('*', cors());
app.use(morgan('dev'));

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50MB'}));

// catch 404 and forward to error handler

app.use(function (req, res, next) {
   
     res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});


app.use('/api', apiRoutes);
// API routes
require('./routes')(apiRoutes);
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
});
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});
module.exports = app;
