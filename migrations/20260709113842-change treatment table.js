'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 💡 获取当前 treatments 表的真实结构，用来做安全检查
      const tableDefinition = await queryInterface.describeTable('treatments');

      // 1. 安全移除老旧的复合索引
      try {
        await queryInterface.removeIndex('treatments', ['date', 'time'], { transaction });
      } catch (e) {
        // 静默跳过
      }

      // 2. 💡 修复点：只有当字段确实存在时，才执行 removeColumn
      const columnsToRemove = [
        'date', 'start_time', 'end_time', 'staff_id',
        'room_id', 'location', 'payment', 'payment_date',
        'reminder_sent', 'reminder_sent_at', 'customer_id' // 把可能漏掉的也顺便兼容进去
      ];

      for (const column of columnsToRemove) {
        if (tableDefinition[column]) {
          await queryInterface.removeColumn('treatments', column, { transaction });
        }
      }

      // 3. 💡 安全更名：只有当老字段 amount 存在且新字段 total 还不存在时才更名
      if (tableDefinition['amount'] && !tableDefinition['total']) {
        await queryInterface.renameColumn('treatments', 'amount', 'total', { transaction });
      }

      // 4. 💡 安全新增：只有当 added_by 真的不存在时才追加
      if (!tableDefinition['added_by']) {
        await queryInterface.addColumn('treatments', 'added_by', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: '创建该记录的操作员ID',
          after: tableDefinition['balance'] ? 'balance' : 'name' // 容错判断 after 位置
        }, { transaction });
      }

      await transaction.commit();
      console.log('✅ Treatments 表成功缩减，字段重命名与 added_by 写入完毕！');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ 迁移执行失败，事务已安全回滚:', err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    // 回滚逻辑同理加上安全检查
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableDefinition = await queryInterface.describeTable('treatments');

      if (tableDefinition['total'] && !tableDefinition['amount']) {
        await queryInterface.renameColumn('treatments', 'total', 'amount', { transaction });
      }
      if (tableDefinition['added_by']) {
        await queryInterface.removeColumn('treatments', 'added_by', { transaction });
      }

      const columnsToAdd = ['date', 'start_time', 'end_time', 'customer_id', 'staff_id', 'room_id'];
      for (const col of columnsToAdd) {
        if (!tableDefinition[col]) {
          const type = (col === 'date') ? Sequelize.DATEONLY : ((col === 'start_time' || col === 'end_time') ? Sequelize.TIME : Sequelize.INTEGER);
          await queryInterface.addColumn('treatments', col, { type }, { transaction });
        }
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};