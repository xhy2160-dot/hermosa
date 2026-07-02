// migrations/20260701120328-add-status-to-staffs.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('staffs', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('staffs', 'status');
  }
};