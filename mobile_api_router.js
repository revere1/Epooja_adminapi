var MUsersController = require('./controllers/mobile/UsersController');
var MProductsController = require('./controllers/mobile/ProductsController');
var MDataController = require('./controllers/mobile/DataController');

var express = require('express');


module.exports = function (app) {
    var apiRoutes = express.Router();
    apiRoutes.post('/login',MUsersController.VerifyApiCode,MUsersController.Login);
    apiRoutes.post('/register',MUsersController.VerifyApiCode,MUsersController.Register);
    apiRoutes.post('/add-address',MUsersController.authenticate,MUsersController.saveUserAddress);
    apiRoutes.post('/get-addresses',MUsersController.authenticate,MUsersController.getUserAddresses);


    apiRoutes.get('/categories',MUsersController.authenticate,MProductsController.GetCategories);
    apiRoutes.get('/subcategories/:cat_id',MUsersController.authenticate,MProductsController.GetSubCategories);
    apiRoutes.get('/products/:cat_id',MUsersController.authenticate,MProductsController.GetProductsByCat);
    apiRoutes.get('/products/:cat_id/:scat_id',MUsersController.authenticate,MProductsController.GetProductsBySubCat);
    apiRoutes.get('/product/:pid',MUsersController.authenticate,MProductsController.GetProductDetails); 
    apiRoutes.post('/product-review',MUsersController.authenticate,MProductsController.submitProdReview); 
    
    
    apiRoutes.post('/get-states',MUsersController.authenticate,MDataController.getStates); 
    apiRoutes.get('/get-countries',MUsersController.authenticate,MDataController.getCountries);

    
    app.use('/app', apiRoutes);

    // MUsersController.authenticate,
    // apiRoutes.get('/login', (req, res) => {
    //     res.send('Login');
    // });

    // apiRoutes.get('/homedata', (req, res) => {
    //     res.send('categories,special offers,special items');
    // });

    // apiRoutes.get('/categories', (req, res) => {
    //     res.send('categories');
    // });

    // apiRoutes.get('/sub_categories', (req, res) => {
    //     res.send('sub categories');
    // });

    // apiRoutes.get('/products', (req, res) => {
    //     res.send('sub categories');
    // });

    // apiRoutes.get('/product', (req, res) => {
    //     res.send('sub categories');
    // });    
    // apiRoutes.use(MUsersController.authenticate);
    
};
