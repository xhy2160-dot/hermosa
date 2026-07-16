'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. Remove the old reminder_sent column
    await queryInterface.removeColumn('appointments', 'reminder_sent');

    // 2. Add reminder_24h_sent as a DATETIME column
    await queryInterface.addColumn('appointments', 'reminder_24h_sent', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });

    // 3. Add reminder_1h_sent as a DATETIME column
    await queryInterface.addColumn('appointments', 'reminder_1h_sent', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert: Add back reminder_sent and remove the two new columns
    await queryInterface.addColumn('appointments', 'reminder_sent', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    });

    await queryInterface.removeColumn('appointments', 'reminder_24h_sent');
    await queryInterface.removeColumn('appointments', 'reminder_1h_sent');
  }
};