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
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        staff_id: { // ✅ Changed from staff_name to a proper relational foreign key
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        payment: {
            type: DataTypes.STRING(250),
            allowNull: true,
        },
        payment_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.00,
        },
        remark: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('in-progress', 'completed', 'cancelled', 'no-show'),
            allowNull: true,
            defaultValue: 'in-progress'
        },
        reminder_sent: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
            field: 'reminder_sent'
        },
        reminder_sent_at: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'reminder_sent_at'
        }
    }, {
        timestamps: true,
        tableName: 'treatments',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['customer_id'] },
            { fields: ['date'] },
            { fields: ['status'] },
            { fields: ['staff_id'] }, // ✅ Updated index target from staff_name to staff_id
            { fields: ['location'] },
            { fields: ['date', 'time'] }
        ]
    });

    Treatment.associate = (models) => {
        // Customer Association
        Treatment.belongsTo(models.Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        });

        // ✅ New Staff Association
        Treatment.belongsTo(models.Staff, {
            foreignKey: 'staff_id',
            as: 'staff'
        });
    };

    return Treatment;
};