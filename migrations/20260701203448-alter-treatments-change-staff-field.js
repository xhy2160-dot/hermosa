'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. Add the new staff_id column
    await queryInterface.addColumn('treatments', 'staff_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      // If you already have data in your treatments table, 
      // set allowNull to true temporarily, or provide a defaultValue:
      // defaultValue: 1 
      references: {
        model: 'Staffs', // Matches the exact table name of your Staff model in DB
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // 2. Remove the old staff_name column
    await queryInterface.removeColumn('treatments', 'staff_name');
  },

  async down(queryInterface, Sequelize) {
    // Revert changes in exact reverse order:

    // 1. Re-add staff_name column
    await queryInterface.addColumn('treatments', 'staff_name', {
      type: Sequelize.STRING(100),
      allowNull: false
    });

    // 2. Drop the staff_id column
    await queryInterface.removeColumn('treatments', 'staff_id');
  }
};