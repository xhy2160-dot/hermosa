import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const ActivityLog = sequelize.define('ActivityLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.ENUM('added', 'edited', 'cancelled', 'login', 'system'),
            allowNull: false,
        },
        actor: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        verb: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        object: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'activity_logs',
        timestamps: true, // adds createdAt and updatedAt columns automatically
        underscored: true,
    });

    return ActivityLog;

}