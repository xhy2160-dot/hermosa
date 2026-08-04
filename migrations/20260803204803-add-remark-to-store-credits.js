'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('store_credits', 'remark', {
      type: Sequelize.TEXT, // Match the type defined in your model
      allowNull: true,
      defaultValue: null,
      after: 'staff_name', // Places the column after staff_name in MySQL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('store_credits', 'remark');
  }
};