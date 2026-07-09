import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class SubTreatment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Belongs to a parent Treatment
            SubTreatment.belongsTo(models.Treatment, {
                foreignKey: 'treatment_id',
                as: 'treatment',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    SubTreatment.init(
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
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            time: {
                type: DataTypes.TIME,
                allowNull: true
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true
            },
            room: {
                type: DataTypes.STRING,
                allowNull: true
            },
            staff: {
                type: DataTypes.STRING,
                allowNull: true
            },
            remark: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'SubTreatment',
            tableName: 'sub_treatments', // Explicitly maps to underscored table name
            underscored: true,          // Automatically handles created_at / updated_at snake_case mapping
            timestamps: true            // Ensures Sequelize manages timestamps automatically
        }
    );

    return SubTreatment;
};