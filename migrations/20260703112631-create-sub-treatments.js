'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_treatments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      treatment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'treatments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
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
      location: {
        type: Sequelize.STRING, // 🌟 Added location column
        allowNull: true
      },
      room: {
        type: Sequelize.STRING,     // 🌟 Added room column
        allowNull: true
      },
      staff: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('sub_treatments', ['treatment_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sub_treatments');
  }

};
