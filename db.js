import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql'
    timezone: '-04:00',
    dialectOptions: {
        useUTC: false // Prevents MySQL from converting data back to UTC on retrieval
    }
});


export default sequelize;