'use strict';
module.exports = (sequelize, DataTypes) => {
  var mobile_users = sequelize.define('mobile_users', {
    user_name: DataTypes.STRING,
    user_email: DataTypes.STRING,
    user_mobile: DataTypes.INTEGER,
    user_image: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return mobile_users;
};