'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('treatments', 'total_sessions', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      after: 'balance' // 💡 Places the column right after 'balance' in MySQL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('treatments', 'total_sessions');
  }
};