import { Model, DataTypes, Sequelize } from 'sequelize';

export default (sequelize) => {
    class Room extends Model {
        // static associate(models) {
        //     // One room can host multiple sub-treatments over time
        //     if (models.SubTreatment) {
        //         Room.hasMany(models.SubTreatment, {
        //             foreignKey: 'room_id',
        //             as: 'subTreatments'
        //         });
        //     }
        // }
    }

    Room.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            location: {
                type: Sequelize.ENUM('NY', 'RH'),
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Room',
            tableName: 'rooms',
            underscored: true,
            timestamps: true
        }
    );

    return Room;
};