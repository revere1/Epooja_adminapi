var models = require('../../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var utils = require('./../../helpers/utils');
var multer = require('multer')
var async = require('async');
var fs = require('fs');
var db = require('./../../models/index');

exports.GetCategories = (req,res)=>
{
    models.categories.findOne({
        where: {
            status: 1
        }        
    }).then(function (categories) {
        if (!categories) {
            res.status(201).json({ success: false, message: 'No categories available' });
        } else if (categories) {
            res.status(201).json({
                success: true,
                data: categories
            });
        }
    });
}

exports.GetSubCategories = (req,res)=>
{
    models.subcategories.findOne({
        where: {
            $and : [
                    {category_id: req.body.cat_id},
                    {status: 1}
                ]            
        }        
    }).then(function (subcategories) {
        if (!subcategories) {
            res.status(201).json({ success: false, message: 'No sub categories available' });
        } else if (subcategories) {
            res.status(201).json({
                success: true,
                data: subcategories
            });
        }
    });
}

exports.GetProducts = (req,res)=>
{
    models.products.findOne({
        where: {
            $and : [
                    {category_id: req.body.cat_id},
                    {subcategory_id: req.body.scat_id},
                    {status: 1}
                ]            
        }        
    }).then(function (products) {
        if (!products) {
            res.status(201).json({ success: false, message: 'No products available' });
        } else if (products) {
            res.status(201).json({
                success: true,
                data: products
            });
        }
    });
}
exports.GetProductDetails = (req,res)=>
{
    models.products.findOne({
        where: {
            $and : [
                    {id: req.body.pid},
                    {status: 1}
                ]            
        }        
    }).then(function (product) {
        if (!product) {
            res.status(201).json({ success: false, message: 'Products details not available' });
        } else if (product) {
            res.status(201).json({
                success: true,
                data: product
            });
        }
    });  
}
  
