// migrations/20240701000000-create-customers-table.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      preferred_location: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      preferred_doctor: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      preferred_day: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: true
      },
      preferred_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      preferred_contact: {
        type: Sequelize.ENUM('phone', 'email', 'text'),
        allowNull: false,
        defaultValue: 'email'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'active'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('customers', ['email'], { unique: true });
    await queryInterface.addIndex('customers', ['phone']);
    await queryInterface.addIndex('customers', ['preferred_location']);
    await queryInterface.addIndex('customers', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customers');
  }
};