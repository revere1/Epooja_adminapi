var models = require('../../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var jwt = require('jsonwebtoken');
var config = require('./../../config/config.json')['system'];
var utils = require('./../../helpers/utils');
var crypto = require('crypto');
var multer = require('multer')
var async = require('async');
var md5 = require('md5');
var fs = require('fs');
var db = require('./../../models/index');
exports.Register = (req,res)=>
{
    let postData = JSON.parse(req.body);
    console.log(postData);
    res.json({'status':true,'message':'Register Success'});
};

exports.Login = (req,res)=>{
    res.json({'status':true,'message':'Login Success'});
    };


exports.authenticate = function (req, res, next) {

    // check header or url parameters or post parameters for token

    var token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['Authorization'];
    if (token) {
        jwt.verify(token, config.jwt_app_secretkey, function (err, decoded) {
            if (err) {
                return res.status(201).json({ success: false, message: 'Authenticate token expired, please login again.', errcode: 'exp-token' });
            } else {
                req.decoded = decoded;
                req.app.locals.decodedData = decoded;
                next();
            }
        });
    } else {
        return res.status(201).json({
            success: false,
            message: 'Fatal error, Authenticate token not available.',
            errcode: 'no-token'
        });
    }
}

exports.VerifyApiCode = function(req, res, next)
{
    var api_code = req.body.api_code || req.query.api_code;
   
    if(api_code)
    {
        if(config.api_code == api_code)
        {
            next();
        }
        else
        {
            return res.status(201).json({ success: false, message: 'Invalid Request.', errcode: 'invalid-request' });
        }
    }
    else
    {
            return res.status(401).json({ success: false, message: 'You are not allowed to access this request', errcode: 'invalid-request' });
    }    
};

