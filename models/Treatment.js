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
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Customer ID is required' }
            }
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
        total_sessions: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '创建该记录的操作员ID'
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('in-progress', 'completed', 'cancelled', 'no-show'),
            allowNull: false,
            defaultValue: 'in-progress'
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
        if (models.Customer) {
            Treatment.belongsTo(models.Customer, {
                foreignKey: 'customer_id',
                as: 'customer' // 后端路由里包含时请使用 include: [{ model: Customer, as: 'customer' }]
            });
        }
        if (models.Staff) {
            Treatment.belongsTo(models.Staff, {
                foreignKey: 'added_by',
                as: 'staff',
            });
        }
        if (models.Appointment) {
            Treatment.hasMany(models.Appointment, {
                foreignKey: 'treatment_id', // 确保这是 Appointment 表里的外键字段名
                as: 'appointments',         // 对应你之前 include 里的别名
            });
        }
        if (models.InstallPayment) {
            Treatment.hasMany(models.InstallPayment, {
                foreignKey: 'treatment_id',
                as: 'payments', // 对应你在路由里 include 的别名
            });
        }
    };

    return Treatment;
};