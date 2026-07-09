'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // 1. 💡 将原有的 'time' 字段重命名为 'start_time'
    await queryInterface.renameColumn('treatments', 'time', 'start_time');

    // 2. 💡 在 'start_time' 后面追加 'end_time' 字段
    await queryInterface.addColumn('treatments', 'end_time', {
      type: Sequelize.TIME,
      allowNull: true, // 允许为空以兼容历史数据，后续有需要可改为 false
      comment: '结束时间',
      after: 'start_time' // 保证物理顺序紧跟在 start_time 后面
    });
  },

  async down(queryInterface, Sequelize) {
    // 撤销迁移时的回滚逻辑
    await queryInterface.removeColumn('treatments', 'end_time');
    await queryInterface.renameColumn('treatments', 'start_time', 'time');
  }
};