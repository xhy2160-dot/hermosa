// models/Appointment.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Appointment = sequelize.define('Appointment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        treatment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '关联的疗程/项目单ID'
        },
        title: {
            type: DataTypes.STRING(250),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Appointment title is required' }
            },
            comment: '预约标题/服务名称摘要'
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: { msg: 'Valid date is required' }
            },
            comment: '预约日期'
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
            comment: '开始时间'
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
            comment: '结束时间'
        },
        location: {
            type: DataTypes.ENUM('NY', 'RH'),
            allowNull: false,
            comment: '门店位置'
        },
        room: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '房间id'
        },
        assigned_staff: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '被指派的员工ID'
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: '备注信息'
        },
        reminder_sent: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            comment: '提醒发送时间，未发送则为 null'
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'no-show'),
            allowNull: false,
            defaultValue: 'scheduled',
            comment: '预约状态'
        }
    }, {
        timestamps: true,
        tableName: 'appointments',
        // 💡 严格与迁移脚本中的下划线时间戳物理字段对齐
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['location', 'date'] },
            { fields: ['assigned_staff'] }
        ]
    });

    Appointment.associate = (models) => {
        // 💡 1. 关联到精简后的新 treatments 财务表
        if (models.Treatment) {
            Appointment.belongsTo(models.Treatment, {
                foreignKey: 'treatment_id',
                as: 'treatment'
            });
        }

        // 💡 2. 关联到 Staff (员工模型)
        if (models.Staff) {
            Appointment.belongsTo(models.Staff, {
                foreignKey: 'assigned_staff',
                as: 'staff'
            });
        }

        // 💡 3. 因为你的 room 已经改成了 INTEGER (房间 ID)，如果已有 Room 模型可以建立关联
        if (models.Room) {
            Appointment.belongsTo(models.Room, {
                foreignKey: 'room',
                as: 'room_name'
            });
        }
    };

    return Appointment;
};