'use strict';
module.exports = (sequelize, DataTypes) => {
  var products = sequelize.define('products', {
    product_name: DataTypes.STRING,
    product_description: DataTypes.STRING,
    cost: DataTypes.STRING,
    quatity: DataTypes.STRING,
    path: DataTypes.STRING
  },  {
    classMethods: {
      associate: function(models) {
        products.belongsTo(models.users, {
          foreignKey: 'createdBy',
          onUpdate: 'CASCADE',
          onDelete: 'NO ACTION'
        });
        products.belongsTo(models.users, {
          foreignKey: 'updatedBy',
          onUpdate: 'CASCADE',
          onDelete: 'NO ACTION'
        });
        products.belongsTo(models.countries, {
          foreignKey: 'countryId',
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        });
        products.belongsTo(models.sectors, {
          foreignKey: 'sectorId',
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        });
      }
    }
  });
  return products;
};