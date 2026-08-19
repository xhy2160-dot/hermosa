export default (sequelize, DataTypes) => {
    const CustomerRecord = sequelize.define('CustomerRecord', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: DataTypes.STRING(50),
        treatment: DataTypes.TEXT,
        locationStaff: DataTypes.STRING(255),
        payment: DataTypes.TEXT,
        amount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total: {
            type: DataTypes.STRING,
            allowNull: true
        },
        balance: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remark: DataTypes.TEXT,
        rowIndex: DataTypes.INTEGER
    }, {
        tableName: 'records',
        timestamps: true
    });
    return CustomerRecord;
};