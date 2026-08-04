'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('store_credits', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      associated_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('appointment', 'treatment', 'manual'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      staff_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for optimized querying
    await queryInterface.addIndex('store_credits', ['customer_id']);
    await queryInterface.addIndex('store_credits', ['associated_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('store_credits');
  }
};
