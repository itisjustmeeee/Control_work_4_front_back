// практика #19 (sequelize - для тех, кому сложнее работать с sql, pg - для тех, кто уже знаком с sql, там чистые sql запросы)
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database_for_front_back',
    password: 'GL19Apw8Nb2',
    port: 5432,
});

module.exports = pool;