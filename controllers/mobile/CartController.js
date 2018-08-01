var models = require('../../models');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.addToCart = function(req,res){
    let uid = req.body.uid;
    let pid = req.body.pid;
    let pcount = req.body.pcount;
    let cerrs = [];

    if(isNaN(uid)){
        cerrs.push('Invalid user id');
    }
    if(isNaN(pid)){
        cerrs.push('Invalid product id');
    }
    if(isNaN(pcount)){
        cerrs.push('Invalid count');
    }

    if(cerrs.length > 0){
        res.json({success:false,cerrors:cerrs});
    }else{
        models.cart.create({
            pid:pid,
            uid:uid,
            pcount:pcount
        }).then(function(cart){

            if(cart){
                res.json({
                    success:true,
                    message:"Product succefully added to cart"
                });
            }else{
                res.json({
                    success:false,
                    message:"Adding product to cart failed. Please try again"
                });
            }

        });
    }


}
exports.removeFromCart = function(req,res){
let cid = req.body.cid;
    if(isNaN(cid))
    {
        res.json({
            success:false,
            message:"Invalid id"
        });    
    }
    else
    {
        models.cart.destroy({
            where:{
                id:cid
            }
        }).then(function(status){
            if(status)
            {
                res.json({
                    success:true,
                    message:"Product successfully removed from cart"
                });    
            }
            else
            {
                res.json({
                    success:false,
                    message:"Product not removed.Please try again"
                });    
            }

        })
    }
}
exports.getCart = function(req,res)
{
    let uid = req.body.uid;
    if(isNaN(uid)){
        res.json({success:false,message:'Something went wrong.Try again'});
    }
    else
    {
    models.cart.hasOne(models.products,{ foreignKey: 'pid' });
    models.cart.findAll({where:{uid:uid}}).then(function(cartitems){
        if(cartitems)
        {
            res.json({success:true,cartitems:cartitems});
        }
        else
        {
            res.json({success:false,message:'Something went wrong.Try again'});
        }
     });
    }
}