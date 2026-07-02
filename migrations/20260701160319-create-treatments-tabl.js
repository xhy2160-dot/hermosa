// migrations/20240701000001-create-treatments-table.js
'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('treatments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(250),
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      staff_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'staff_id'
      },
      location: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      payment: {
        type: Sequelize.STRING(250),
        allowNull: true
      },
      payment_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('in-progress', 'completed', 'cancelled', 'no-show'),
        allowNull: true,
        defaultValue: 'in-progress'
      },
      reminder_sent: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'reminder_sent'
      },
      reminder_sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'reminder_sent_at'
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

    // ✅ Add indexes
    await queryInterface.addIndex('treatments', ['customer_id']);
    await queryInterface.addIndex('treatments', ['date']);
    await queryInterface.addIndex('treatments', ['status']);
    await queryInterface.addIndex('treatments', ['staff_name']);
    await queryInterface.addIndex('treatments', ['location']);
    await queryInterface.addIndex('treatments', ['date', 'time']);

    // ✅ Add foreign key constraint if customers table exists
    await queryInterface.addConstraint('treatments', {
      fields: ['customer_id'],
      type: 'foreign key',
      name: 'fk_treatments_customer_id',
      references: {
        table: 'customers',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // ✅ Remove foreign key constraint first
    await queryInterface.removeConstraint('treatments', 'fk_treatments_customer_id');

    // ✅ Drop the table
    await queryInterface.dropTable('treatments');
  }
};