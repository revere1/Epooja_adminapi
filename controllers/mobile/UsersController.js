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
    let postData = req.body;

    models.mobile_users.findOne({ where: { user_email: postData.user_email} }).then(mobile_user => {
        let result = {};
        if (mobile_user) {
            result.success = false;
            result.message = 'User already existed.';
            res.json(result);
        }
        else {

            if (postData.password == ''  || postData.length < 6 || postData.length >20) {
                result.success = false;
                result.message = 'Password should be between 6,20 characters';
                response.json(result);
            }else{
                postData.password = models.mobile_users.generateHash(postData.password);
            }

            postData = utils.DeepTrim(postData);
            models.mobile_users.create(postData).then(user1 => {
                if (user1){                              
                        result.success = true;
                        result.message = 'User successfully created';
                        res.json(result);
                }
                else{
                    noResults(result, res)
                }
            }).catch(function (err) {
                result.success = false;
                errs = [];
                (err.errors).forEach(er => {           
                   errs.push(er.message);     
                });
                result.message = errs.join(',');
                res.json(result);
              });
        }
    });    
};



exports.Login = (req,res)=>
{
    if(req.body.user_name != '' && req.body.password != '')
    {

    
    let postData = req.body;
    models.mobile_users.findOne({
        where: {
            user_email: postData.user_name
        }        
    }).then(function (user) {
        if (!user) {
            res.status(201).json({ success: false, message: 'Incorrect login credentials.' });
        } else if (user) {
            
            if (user._modelOptions.instanceMethods.validPassword(req.body.password, user)) {

                var token = jwt.sign(user.toJSON(), config.jwt_app_secretkey, {
                    expiresIn: config.jwt_app_expire
                });
                res.status(201).json({
                    success: true,
                    data: {
                        'userid': user.id,
                        'email': user.user_email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'status': user.status,
                        'registerdAt': user.createdAt,
                        'profile_pic':''
                    },
                    token: token
                });
            }
            else {
                res.status(201).json({ success: false, message: 'Incorrect login credentials.' });
            }
        }
    }).catch(function (err) {
        // let result = {};
        // result.success = false;
        // errs = [];
        // (err.errors).forEach(er => {           
        //    errs.push(er.message);     
        // });
        // result.message = errs.join(',');
        res.json(err);
      });
    }else{
        res.status(201).json({ success: false, message: 'Username/Password should not be empty' });
    }
    
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

noResults = (result, response) => {
    result.success = 'failure';
    result.message = 'Something went wrong';
    response.json(result);
}
