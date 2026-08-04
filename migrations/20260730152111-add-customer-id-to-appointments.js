'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'customer_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if customer_id is strictly mandatory
      after: 'id',     // 🌟 Places customer_id directly after the 'id' column (MySQL/MariaDB)
      references: {
        model: 'customers', // Name of your target table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverts the table structure if you ever roll back this migration
    await queryInterface.removeColumn('Appointments', 'customer_id');
  }
};