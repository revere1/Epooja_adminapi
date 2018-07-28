'use strict';
module.exports = (sequelize, DataTypes) => {
  var products = sequelize.define('products', {
    category_id: DataTypes.INTEGER,
    subcategory_id: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    product_code: DataTypes.STRING,
    product_description: DataTypes.STRING,
    path: DataTypes.STRING,
    cost: DataTypes.STRING,
    quatity: DataTypes.STRING,
    status: DataTypes.STRING
  },  {
    classMethods: {
      associate: function(models) {
        products.belongsTo(models.category, {
          foreignKey: 'category_id',
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        });
        products.belongsTo(models.subcategory, {
          foreignKey: 'subcategory_id',
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        });
      }
    }
  });
  return products;
};