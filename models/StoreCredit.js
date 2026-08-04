import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class StoreCredit extends Model { }

    StoreCredit.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'customers', // Table name for Customer
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT', // Prevents deleting customer if store credit history exists
            },
            associated_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Generic reference ID (e.g., appointment_id, treatment_id, or payment_id)',
            },
            type: {
                type: DataTypes.ENUM('appointment', 'treatment', 'manual'),
                allowNull: false,
                comment: 'Transaction category: credit addition, usage, refund, or manual adjustment',
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
                comment: 'Positive for earned/added credit, negative for redeemed/used credit',
            },
            staff_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            remark: {
                type: DataTypes.TEXT, // Or DataTypes.STRING(255) if you want a fixed length limit
                allowNull: true,
                defaultValue: null,
                comment: 'Optional notes or reason for the store credit transaction',
            },
        },
        {
            sequelize,
            modelName: 'StoreCredit',
            tableName: 'store_credits',
            timestamps: true, // Automatically manages createdAt and updatedAt
            underscored: true, // Uses customer_id, associated_id, staff_name in DB
            indexes: [
                {
                    fields: ['customer_id'],
                },
                {
                    fields: ['associated_id'],
                },
            ],
        }
    );

    StoreCredit.associate = (models) => {
        StoreCredit.belongsTo(models.Customer, {
            foreignKey: 'customer_id',
            as: 'customer',
        });
    };

    return StoreCredit;
};