var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('./config/config.json')['system'];
var multer = require("multer");
var OAuth2 = require("oauth").OAuth2;
var models = require('./models');
var utils = require('./helpers/utils.js');

// Routes
module.exports = function (app) {
    var apiRoutes = express.Router();
    apiRoutes.get('/', (req, res) => {
        res.send('Welcome to App API');
    });
    app.use('/app', apiRoutes);
};
