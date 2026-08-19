import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const File = sequelize.define('File', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'customer_id'
        },
        fileName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'file_name'
        },
        hash: {
            type: DataTypes.STRING(64),
            allowNull: true,
            unique: false
        }
    }, {
        tableName: 'files',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    File.associate = (models) => {
        File.belongsTo(models.Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        });
    };

    return File;
};