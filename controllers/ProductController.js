var models = require('../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var jwt = require('jsonwebtoken');
var config = require('./../config/config.json')['system'];
var utils = require('./../helpers/utils');
var async = require('async');


//Get all products Method:GET
exports.Products = function (request, response) {
    let $where = {}, not_consider = ['token', 'pageIndex', 'pageSize', 'sortField', 'sortOrder'];
    Object.keys(request.body).forEach(function (item) {
        if (!inArray(item, not_consider) && (request.body[item] != '' && request.body[item] != null && request.body[item] != undefined)) {
            $where[item] = { $like: '%' + request.body[item] + '%' }
        }
    }, this);
    let condition = { where: $where };
    condition['order'] = (request.body.sortField != undefined) ? [[request.body.sortField, request.body.sortOrder]] : [['createdAt', 'Desc']];
    if (request.body.pageSize) {
        var limit = parseInt(request.body.pageSize);
        condition['limit'] = limit + 1;
        var offset = (request.body.pageIndex) ? (limit * parseInt(request.body.pageIndex)) - limit : 0;
        condition['offset'] = offset;
    }
    let json_res = {};
    async.parallel(
        [
            (callback) => {
                Product.findAll(condition).then(projects => {
                    if ((projects.length === limit + 1)) {
                        json_res.itemsCount = offset + limit + 1;
                        projects.splice(-1, 1);
                    }
                    else {
                        json_res.itemsCount = offset + 1;
                    }
                    json_res.data = projects;
                    callback(null);
                });
            }
        ],
        (err, results) => {
            if (err) {
                json_res['status'] = 'failure';
                json_res['itemsCount'] = 0;
                json_res['data'] = {};
            }
            else {
                json_res['status'] = 'success';
            }
            response.json(json_res);
        }
    )
}

exports.DeleteProduct = function (request, response) {
    let id = request.params.id;
    let result = {};
    if (request.params.id != undefined) {
        models.products.destroy({ where: { 'id': id } }).then((rowDeleted) => {
            result.success = true;
            result.message = (rowDeleted === 1) ? 'Product deleted successfully' : 'Unable to delete Product';
            response.json(result);
        }, (err) => {
            result.success = false;
            result.message = 'Something went wrong';
            response.json(result);
        })
    }
    else {
        result.success = false;
        result.message = 'Not selected any Product';
        response.json(result);
    }
};

exports.CreateProduct = function (request, response) {
    let postData = request.body;
    models.products.findOne({ where: { product_name: postData.name } }).then(product => {
        let result = {};
        if (product) {
            result.success = false;
            result.message = 'Product already existed.';
            response.json(result);
        }
        else {
            trimPostData = utils.DeepTrim(postData)
            models.products.create(trimPostData).then(product => {
                if (product) {
                    result.success = true;
                    result.message = 'Product successfully created';
                }
                else {
                    result.success = true;
                    result.message = 'Product Not  successfully created';
                }
                response.json(result);
            });
        }
    });
};

noResults = (result, response) => {
    result.success = 'failure';
    result.message = 'Something went wrong';
    response.json(result);
}

exports.GetProduct= (req, res) => {
    models.products.findOne({
        where: { id: req.params.id },
    }).then(product => {
        let response = {};
        if (product) {
            response.success = true;
            response.data = {
                'product_name': product.product_name,
                'product_description':product.product_description,
                'cost':product.cost,
                'quatity':product.quatity,
                'category_id': product.category_id,
                'subcategoryId': product.subcategoryId,
                'id': product.id
            };
        }
        else {
            response.success = false;
            response.message = 'No  found';
        }
        res.json(response);
    });
}

exports.Products = function (req, res, next) {
    if (utils.objLen(req.query)) Object.assign(where, req.query);
    models.products.findAll({
        attributes: ['id', 'name'],
        where: where
    }).then(function (products) {
        if (!products) {
            res.status(201).json({ success: false, message: 'Products Not Found.' });
        } else if (products) {
            res.status(201).json({
                success: true,
                data: products
            });
        }
    });
}
exports.FilterProducts = (req, res) => {
    filterProducts(req, res, (records) => {
        return res.json(records);
    });
}

filterProducts = (req, res, cb) => {
    models.products = models.products;
    //models.products.belongsTo(models.sectors);
    //models.products.belongsTo(models.countries);
    //models.products.belongsTo(models.users, { foreignKey: 'createdBy' });
    pData = req.body;
    where = sort = {};
    if (pData.columns.length) {
        (pData.columns).forEach(col => {
            if ((col.search.value).length) {
                let cond = {};
                cond[col.data] = col.search.value;
                Object.assign(where, cond);
            }
        });
        if ((pData.search.value).length) {
            let likeCond = [];
            (pData.columns).forEach(col => {
                let item = {
                    [col.data]: {
                        [Op.like]: `%${pData.search.value}%`
                    }
                }
                likeCond.push(item);
            });
            // likeCond.push(Sequelize.where(Sequelize.fn('concat', Sequelize.col(`user.first_name`), ' ', Sequelize.col(`user.last_name`)), {
            //     like: '%' + pData.search.value + '%'
            // }));
            // likeCond.push(Sequelize.where(Sequelize.col(`country.name`), {
            //     like: '%' + pData.search.value + '%'
            // }));
            // likeCond.push(Sequelize.where(Sequelize.col(`sector.name`), {
            //     like: '%' + pData.search.value + '%'
            // }));
            where = { [Op.or]: likeCond };
        }
    }
    let orderBy = [pData.columns[pData.order[0].column].data, pData.order[0].dir];

    let options = {
        where: where,
        attributes: ['id', 'product_name', 'product_description', 'cost', 'quatity'],
        include: [
            // {
            //     model: models.sectors,
            //     attributes: ['name']
            // },
            // {
            //     model: models.countries,
            //     attributes: ['name']
            // },
            // {
            //     model: models.users,
            //     attributes: [[Sequelize.literal('concat(`user`.`first_name`," ",`user`.`last_name`)'), 'Name']]
            // },
        ],
        raw: true
    };
    async.parallel([
        (callback) => {
            models.products.findAll(options).then(projects => {
                callback(null, projects.length);
            }).catch(function (err) {
                callback(err);
            });
        },
        (callback) => {
            Object.assign(options, { order: [orderBy], limit: pData.length, offset: pData.start });
            models.products.findAll(options).then(products => {
                    callback(null, products);
                }).catch(function (err) {
                    callback(err);
                });
        }
    ], (err, results) => {
        let json_res = {};
        json_res['draw'] = pData.draw;
        if (err) {
            json_res['success'] = false;
            json_res['recordsTotal'] = 0;
            json_res['recordsFiltered'] = 0;
            json_res['message'] = err;
            json_res['data'] = [];
        }
        else {
            json_res['recordsTotal'] = results[0];
            json_res['recordsFiltered'] = results[0];
            json_res['data'] = results[1];
        }
        cb(json_res);
    })
}

exports.AutoSearchProducts = function (request, response) {
    let term = request.query.p;
    models.products.findOne({
        where: {
            name: {
                $like: '%' + term + '%'
            }
        },
        attributes: ['id', ['name', 'sku']],
        required: false
    }).then(products => {
        $result = [];
        if (products) $result.push(products);
        response.json($result);
    }).catch(function (err) {
        response.json([]);
    });
};

exports.UpdateProduct = function (request, response) {
    let postData = request.body;
    models.products.findOne({ where: { id: postData.id }, required: false }).then(products => {
        let result = {};
        if (products) {
            trimPostData = utils.DeepTrim(postData)
            products.updateAttributes(trimPostData).then((updateProucts) => {
                if (updateProducts) {
                    result.success = true;
                    result.message = 'Product Updated successfully ';
                } else {
                    result.success = true;
                    result.message = 'Product not Updated successfully ';
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
        else {
            result.success = false;
            result.message = 'Product not existed.';
            response.json(result);
        }
    });
};