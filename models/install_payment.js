import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class InstallPayment extends Model {
        static associate(models) {
            // Belongs to a parent Treatment
            InstallPayment.belongsTo(models.Treatment, {
                foreignKey: 'treatment_id',
                as: 'treatment',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
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
                references: {
                    model: 'treatments',
                    key: 'id'
                }
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