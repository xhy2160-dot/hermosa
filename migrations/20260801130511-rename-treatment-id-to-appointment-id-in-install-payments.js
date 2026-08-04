'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('install_payments', 'appointment_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if appointment_id is strictly required
      after: 'treatment_id', // 🌟 Places appointment_id directly after 'treatment_id' (MySQL/MariaDB)
    });

    await queryInterface.addColumn('install_payments', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'appointment_id', // 🌟 Places column directly after appointment_id (MySQL/MariaDB)
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverts the table structure if you ever roll back this migration
    await queryInterface.removeColumn('install_payments', 'appointment_id');
    await queryInterface.removeColumn('install_payments', 'type');
  }
};