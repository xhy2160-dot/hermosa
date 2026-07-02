// models/Staff.js
import { DataTypes } from 'sequelize';

// ✅ Don't import sequelize here - it will be passed from index.js
export default (sequelize) => {
    const Staff = sequelize.define('Staff', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'staff'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active',
            validate: {
                isIn: [['active', 'inactive']] // Validates only these values
            }
        }
    }, {
        timestamps: true,
        tableName: 'staffs' // Optional: specify table name
    });

    return Staff;
};