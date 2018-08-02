'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      desc: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      dtype: {
        type: Sequelize.INTEGER
      },
      dvalue: {
        type: Sequelize.BIGINT
      },
      limit: {
        type: Sequelize.INTEGER
      },
      lvalue: {
        type: Sequelize.BIGINT
      },
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('offers');
  }
};