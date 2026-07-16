'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      treatment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '关联的疗程/项目单ID'
      },
      title: {
        type: Sequelize.STRING(250),
        allowNull: false,
        comment: '预约标题/服务名称摘要'
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: '预约日期'
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
        comment: '开始时间'
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
        comment: '结束时间'
      },
      location: {
        type: Sequelize.ENUM('NY', 'RH'),
        allowNull: false,
        comment: '门店位置'
      },
      room: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '房间id'
      },
      assigned_staff: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '被指派的员工ID'
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '备注信息'
      },
      reminder_sent: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        comment: '提醒发送时间，未发送则为 null'
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'completed', 'cancelled', 'no-show'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: '预约状态'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 💡 针对高频的日历看板查询建立复合索引，大幅提升多门店/按天筛选时的渲染速度
    await queryInterface.addIndex('appointments', ['location', 'date']);
    await queryInterface.addIndex('appointments', ['assigned_staff']);

    await queryInterface.addConstraint('appointments', {
      fields: ['treatment_id'],
      type: 'foreign key',
      name: 'fk_appointments_treatment_id',
      references: {
        table: 'treatments',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('appointments', 'fk_appointments_treatment_id');
    await queryInterface.dropTable('appointments');
  }
};