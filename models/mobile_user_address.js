'use strict';
module.exports = (sequelize, DataTypes) => {
  var mobile_user_address = sequelize.define('mobile_user_address', {
    user_id: DataTypes.INTEGER,
    company: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return mobile_user_address;
};