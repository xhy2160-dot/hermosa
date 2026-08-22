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
        workbook: {
            type: DataTypes.TEXT('medium'),
            allowNull: true,
            get() {
                // Optional: Automatically parse JSON when accessing record.workbook
                const rawValue = this.getDataValue('workbook');
                return rawValue ? JSON.parse(rawValue) : null;
            },
            set(value) {
                // Optional: Automatically stringify object before saving to database
                this.setDataValue('workbook', typeof value === 'object' ? JSON.stringify(value) : value);
            }
        }
    }, {
        tableName: 'records',
        timestamps: true
    });
    return CustomerRecord;
};