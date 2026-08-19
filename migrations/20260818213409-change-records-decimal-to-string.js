'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. Change amount column to STRING
    await queryInterface.changeColumn('records', 'amount', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // 2. Change total column to STRING
    await queryInterface.changeColumn('records', 'total', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // 3. Change balance column to STRING
    await queryInterface.changeColumn('records', 'balance', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to DECIMAL(10, 2) if rolling back
    await queryInterface.changeColumn('records', 'amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });

    await queryInterface.changeColumn('records', 'total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });

    await queryInterface.changeColumn('records', 'balance', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  }
};