'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. 检查当前表结构，防止重复添加
      const tableDefinition = await queryInterface.describeTable('treatments');

      if (!tableDefinition['customer_id']) {
        // 2. 重新追加 customer_id 字段
        await queryInterface.addColumn('treatments', 'customer_id', {
          type: Sequelize.INTEGER,
          allowNull: false, // 如果允许历史单据没有客户，可以设为 true
          comment: '关联的客户/患者ID',
          after: 'id' // 放在 id 字段后面
        }, { transaction });

        // 3. 重新建立外键约束，指向 customers 表的 id
        await queryInterface.addConstraint('treatments', {
          fields: ['customer_id'],
          type: 'foreign key',
          name: 'fk_treatments_customer_id',
          references: {
            table: 'customers',
            field: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }, { transaction });

        // 4. 为高频的客户消费历史查询建立索引
        await queryInterface.addIndex('treatments', ['customer_id'], { transaction });
      }

      await transaction.commit();
      console.log('✅ 成功将 customer_id 加回 treatments 表并建立外键约束！');
    } catch (err) {
      await transaction.rollback();
      console.error('❌ 加回 customer_id 失败，事务已回滚:', err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const tableDefinition = await queryInterface.describeTable('treatments');

      if (tableDefinition['customer_id']) {
        try {
          await queryInterface.removeConstraint('treatments', 'fk_treatments_customer_id', { transaction });
        } catch (e) { /* 静默跳过 */ }

        await queryInterface.removeColumn('treatments', 'customer_id', { transaction });
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};