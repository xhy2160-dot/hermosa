// models/Treatment.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Treatment = sequelize.define('Treatment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(250),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Treatment name is required' }
            }
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: '总金额'
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
            comment: '未付尾款/余额'
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '创建该记录的操作员ID'
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'treatments',
        // 💡 显式声明下划线物理列名，对应 Sequelize 的自动时间戳
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            // 💡 清理了所有失效字段的索引，仅为操作员审计和高频财务查询保留基础索引
            { fields: ['added_by'] }
        ]
    });

    Treatment.associate = (models) => {
        // 💡 建立 added_by 与 Staff 模型的属于(belongsTo)关系
        // 这样后续你可以直接通过 include: ['creator'] 查出是谁创建的单子
        if (models.Staff) {
            Treatment.belongsTo(models.Staff, {
                foreignKey: 'added_by',
                as: 'creator'
            });
        }
    };

    return Treatment;
};