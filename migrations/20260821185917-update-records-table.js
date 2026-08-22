'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Drop existing obsolete columns
      const columnsToRemove = [
        'date',
        'treatment',
        'locationStaff',
        'payment',
        'amount',
        'total',
        'balance',
        'remark',
        'rowIndex'
      ];

      for (const column of columnsToRemove) {
        await queryInterface.removeColumn('Records', column, { transaction });
      }

      // 2. Add new workbook column as MEDIUMTEXT
      await queryInterface.addColumn(
        'Records',
        'workbook',
        {
          type: Sequelize.TEXT('medium'), // Generates MEDIUMTEXT in MySQL/MariaDB
          allowNull: true, // Set to false if required
        },
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      // Revert: Remove workbook column
      await queryInterface.removeColumn('Records', 'workbook', { transaction });

      // Revert: Re-add removed columns
      await queryInterface.addColumn('Records', 'date', { type: Sequelize.DATE }, { transaction });
      await queryInterface.addColumn('Records', 'treatment', { type: Sequelize.STRING }, { transaction });
      await queryInterface.addColumn('Records', 'locationStaff', { type: Sequelize.STRING }, { transaction });
      await queryInterface.addColumn('Records', 'payment', { type: Sequelize.STRING }, { transaction });
      await queryInterface.addColumn('Records', 'amount', { type: Sequelize.DECIMAL(10, 2) }, { transaction });
      await queryInterface.addColumn('Records', 'total', { type: Sequelize.DECIMAL(10, 2) }, { transaction });
      await queryInterface.addColumn('Records', 'balance', { type: Sequelize.DECIMAL(10, 2) }, { transaction });
      await queryInterface.addColumn('Records', 'remark', { type: Sequelize.TEXT }, { transaction });
      await queryInterface.addColumn('Records', 'rowIndex', { type: Sequelize.INTEGER }, { transaction });
    });
  }
};