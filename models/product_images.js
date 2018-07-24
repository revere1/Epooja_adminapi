'use strict';
module.exports = (sequelize, DataTypes) => {
  var product_images = sequelize.define('product_images', {
    productId: DataTypes.STRING,
    mime_tyep: DataTypes.STRING,
    path: DataTypes.STRING,
    orgName: DataTypes.STRING
  },  {
    classMethods: {
      associate: function(models) {
        product_images.belongsTo(models.products, {
          foreignKey: 'productId',
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        });
      }
    }
  });
  return product_images;
};