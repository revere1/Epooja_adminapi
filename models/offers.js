'use strict';
module.exports = (sequelize, DataTypes) => {
  var offers = sequelize.define('offers', {
    desc: DataTypes.STRING,
    code: DataTypes.STRING,
    dtype: DataTypes.INTEGER,
    dvalue: DataTypes.BIGINT,
    limit: DataTypes.INTEGER,
    lvalue: DataTypes.BIGINT,
    status: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return offers;
};