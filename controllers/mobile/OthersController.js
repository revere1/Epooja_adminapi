var models = require('../../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var utils = require('./../../helpers/utils');
var multer = require('multer')
var async = require('async');
var fs = require('fs');
var db = require('./../../models/index');


exports.getBanners = function(req,res){
models.banners.findAll({
    where:{
        status:1
    }
}).then(data=>{
    if(data){
        res.json({success:true,banners:data})
    }else{
        res.json({success:false,banners:[]});
    }
});
}

exports.getOffers = function(req,res)
{
    models.offers.findAll({
        where:{
            status:1
        }
    }).then(data=>{
        if(data){
            res.json({success:true,offers:data})
        }else{
            res.json({success:false,offers:[]});
        }
    });
}