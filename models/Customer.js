// models/Customer.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Customer = sequelize.define('Customer', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Name is required'
                },
                len: {
                    args: [2, 100],
                    msg: 'Name must be between 2 and 100 characters'
                }
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                isEmail: {
                    msg: 'Please provide a valid email address'
                },
                notEmpty: {
                    msg: 'Email is required'
                }
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Phone number is required'
                }
            }
        },
        preferred_location: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: '',
            field: 'preferred_location'
        },
        preferred_doctor: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'preferred_doctor'
        },
        preferred_day: {
            type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
            allowNull: true,
            field: 'preferred_day'
        },
        preferred_time: {
            type: DataTypes.TIME,
            allowNull: true,
            field: 'preferred_time'
        },
        preferred_contact: {
            type: DataTypes.ENUM('phone', 'email', 'text'),
            allowNull: false,
            defaultValue: 'email',
            field: 'preferred_contact',
            validate: {
                isIn: {
                    args: [['phone', 'email', 'text']],
                    msg: 'Preferred contact must be phone, email, or text'
                }
            }
        },
        language: {
            type: DataTypes.STRING,
            defaultValue: 'EN'
        },
        reminder_type: {
            type: DataTypes.STRING,
            defaultValue: '24 hour'
        },
        // Additional fields for better tracking
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'archived'),
            allowNull: false,
            defaultValue: 'active'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'customers',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['preferred_location']
            },
            {
                fields: ['preferred_doctor']
            },
            {
                fields: ['status']
            }
        ]
    });

    // ✅ Add any associations here
    Customer.associate = (models) => {
        // Example: Customer.hasMany(models.Appointment, { foreignKey: 'customerId' });
    };

    return Customer;
};