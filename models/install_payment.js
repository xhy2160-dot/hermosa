import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class InstallPayment extends Model {
    }

    InstallPayment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            treatment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            payment_method: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'InstallPayment',
            tableName: 'install_payments',
            underscored: true,
            timestamps: true
        }
    );

    return InstallPayment;
};