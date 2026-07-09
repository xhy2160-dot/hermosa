'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // 💡 1. 检查 treatments 表的结构
    const tableDefinition = await queryInterface.describeTable('treatments');

    // 💡 2. 只有当 room_id 不存在时，才执行添加列的逻辑
    if (!tableDefinition.room_id) {
      await queryInterface.addColumn('treatments', 'room_id', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        comment: '关联的空间/房间ID',
        after: 'id'
      });

      // 添加外键约束
      await queryInterface.addConstraint('treatments', {
        fields: ['room_id'],
        type: 'foreign key',
        name: 'fk_treatments_room_id',
        references: {
          table: 'rooms',
          field: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    } else {
      console.log('⚠️ room_id 字段在数据库中已存在，自动跳过此步骤。');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable('treatments');
    if (tableDefinition.room_id) {
      await queryInterface.removeConstraint('treatments', 'fk_treatments_room_id');
      await queryInterface.removeColumn('treatments', 'room_id');
    }
  }
};