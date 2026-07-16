'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. Add the language column (e.g., 'en', 'es', 'fr')
    await queryInterface.addColumn('customers', 'language', {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: 'EN', // Optional: set a default language
    });

    // 2. Add the reminder_type column (e.g., 'sms', 'email', 'whatsapp', 'none')
    await queryInterface.addColumn('customers', 'reminder_type', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: '24 hour', // Optional: set a default reminder type
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes in reverse order if things go wrong
    await queryInterface.removeColumn('customers', 'reminder_type');
    await queryInterface.removeColumn('customers', 'language');
  }
};