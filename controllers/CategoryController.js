var models = require('../models');
var Sequelize = require('sequelize');
var jwt    = require('jsonwebtoken');
var config    = require('./../config/config.json')['system'];
var utils = require('./../helpers/utils.js');
const Op = Sequelize.Op;
var async = require('async');
//var app   = require('../app');
exports.CreateCategories = function (request, response) {
    let postData = utils.DeepTrim(request.body);
    models.category.findOne({ where: { name: postData.name } }).then(categories => {
        let result = {};
        if (categories) {
            result.success = false;
            result.message = 'sector already existed.';
            response.json(result);
        }
        else {
            models.category.create(postData).then(categories => {
                if (categories) {
                    result.success = true;
                    result.message = 'Sector successfully created';
                }
                else {
                    result.success = true;
                    result.message = 'Sector not successfully created';
                }
                response.json(result);
            });
        }
    });
};

//Get Categories values with database update 
exports.GetCategories = (req, res) => {
    models.category.findOne({
        where: { id: req.params.id }
    }).then(categories => {
        let response = {};
        if (categories) {
            response.success = true;
            response.data = {
                'name': category.category_name,
                'status': categories.status,
                'id': categories.id
            };
        }
        else {
            response.success = false;
            response.message = 'No Categories found';
        }
        res.json(response);
    });
}


exports.UpdateCategory = function(request, response){
    let postData = utils.DeepTrim(request.body);
    models.category.findOne({ where: {id: postData.id}, required: false}).then(categories => {
            let result = {};
            if(categories){                                         
                    categories.updateAttributes(postData).then((updateCategory)=>{
                            if(updateCategory){
                                    result.success = true;
                                    result.message = 'Category Updated successfully ';
                            }else{
                                    result.success = true;
                                    result.message = 'Category not Updated successfully '; 
                            }
                            response.json(result);     
                    }).catch(Sequelize.ValidationError, function (err) {
                            // respond with validation errors
                            
                            return response.status(200).json({
                                    success: false,
                                    message: err.message
                            });
                    }).catch(function (err) {
                            // every other error                               
                            return response.status(400).json({
                                    success: false,
                                    message: err
                            });
                    });
            }
            else{
                    result.success = false;
                    result.message = 'Category not existed.';
                    response.json(result);                     
            }             
    });     
};

exports.Categories = function (req, res, next) {
    let where = {};
    where['status'] = 'active';
    if (utils.objLen(req.query)) Object.assign(where, req.query);
    // find categories
    models.category.findAll({
        attributes: ['id', 'category_name'],
        where: where
    }).then(function (categories) {
        if (!categories) {
            res.status(201).json({ success: false, message: 'Categories Not Found.' });
        } else if (categories) {
            res.status(201).json({
                success: true,
                data: categories
            });
        }
    });
}

exports.FilterCategories = (req, res)=>{
    filterCategories(req, res,(records)=>{
            return res.json(records);
        });
}

filterCategories = (req, res ,cb)=>{
    pData = req.body;
    where = sort = {};
    if(pData.columns.length){       
        (pData.columns).forEach(col => {           
            if((col.search.value).length){
                let cond = {};
                cond[col.data] = col.search.value;
                Object.assign(where,cond);
            }          
        });
        if((pData.search.value).length){
            let likeCond = [];
            (pData.columns).forEach(col => {
                let item = {
                        [col.data] : {
                            [Op.like] : `%${pData.search.value}%`
                        }
                    }   
                likeCond.push(item);
            });
            where = {[Op.or] : likeCond};
        }      
    }
   
    let orderBy = [pData.columns[pData.order[0].column].data , pData.order[0].dir];

    async.parallel([
        (callback) => {
            models.category.findAll({where: where,attributes:['id']}).then(projects => {                    
                callback(null,projects.length);
            }).catch(function (err) {
                callback(err);
            });                
        },
        (callback) => {
            models.category.findAll({ where: where,
                order: [
                    orderBy
                ],
                limit:pData.length, offset:pData.start})
            .then(categories => {
                callback(null,categories);
            })
            .catch(function (err) {
                callback(err);
            });                        
        }
    ],(err,results) => {
            let json_res = {};
            json_res['draw'] = pData.draw;
        if(err){            
            json_res['success'] = false;
            json_res['recordsTotal'] = 0;
            json_res['recordsFiltered'] = 0;
            json_res['message'] = err;    
            json_res['data'] = [];              
        }
        else{
            json_res['success'] = true;
            json_res['recordsTotal'] = results[0];
            json_res['recordsFiltered'] = results[0];
            json_res['data'] = results[1];
        }                   
        cb(json_res);
    })
};


exports.FilterContacts = (req, res)=>{
    filterContacts(req, res,(records)=>{
            return res.json(records);
        });
}

filterContacts = (req, res ,cb)=>{
    pData = req.body;
    where = sort = {};
    if(pData.columns.length){       
        (pData.columns).forEach(col => {           
            if((col.search.value).length){
                let cond = {};
                cond[col.data] = col.search.value;
                Object.assign(where,cond);
            }          
        });
        if((pData.search.value).length){
            let likeCond = [];
            (pData.columns).forEach(col => {
                let item = {
                        [col.data] : {
                            [Op.like] : `%${pData.search.value}%`
                        }
                    }   
                likeCond.push(item);
            });
            where = {[Op.or] : likeCond};
        }      
    }
   
    let orderBy = [pData.columns[pData.order[0].column].data , pData.order[0].dir];

    async.parallel([
        (callback) => {
            models.contact_us.findAll({where: where,attributes:['id']}).then(projects => {                    
                callback(null,projects.length);
            }).catch(function (err) {
                callback(err);
            });                
        },
        (callback) => {
            models.contact_us.findAll({ where: where,
                attributes:['id','name','mobile','email','comments'],
                order: [
                    orderBy
                ],
                limit:pData.length, offset:pData.start})
            .then(contact_us => {
                callback(null,contact_us);
            })
            .catch(function (err) {
                callback(err);
            });                        
        }
    ],(err,results) => {
            let json_res = {};
            json_res['draw'] = pData.draw;
        if(err){            
            json_res['success'] = false;
            json_res['recordsTotal'] = 0;
            json_res['recordsFiltered'] = 0;
            json_res['message'] = err;    
            json_res['data'] = [];              
        }
        else{
            json_res['success'] = true;
            json_res['recordsTotal'] = results[0];
            json_res['recordsFiltered'] = results[0];
            json_res['data'] = results[1];
        }                   
        cb(json_res);
    })
};
exports.DeleteCategory = function(request, response){
    // let id = request.params.id;
    let result = {};
    if(request.params.id != undefined){
        models.category.destroy({where: {id: request.params.id}}).then((rowDeleted)=>{
            result.success = true;
            result.message = (rowDeleted === 1) ? 'Category deleted successfully' : 'Unable to delete Category';
            response.json(result);
        },(err)=>{
            result.success = false;
            result.message = 'you must delete SubCategory in this Category ';
            response.json(result);
        })
    }
    else{
        result.success = false;
        result.message = 'Not selected any Category';
        response.json(result);
    }   
};
