// практика #19
const pool = require('../config/db');

const UserModel = {
    async createUser(user) {
        const {first_name, last_name, age} = user;

        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, age)
             VALUES($1, $2, $3)
             RETURNING *
            `,
            [first_name, last_name, age]
        );

        return result.rows[0];
    },

    async getAll() {
        const result = await pool.query(
            'SELECT * FROM users ORDER BY id ASC'
        );
        return result.rows;
    },

    async getById(id) {
        const result = await pool.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async updateUser(id, data) {
        const { first_name, last_name, age } = data;

        const result = await pool.query(
            `UPDATE users
             SET first_name = $2,
                last_name = $3,
                age = $4,
                updated_at = NOW()
             WHERE id = $1
             RETURNING *
            `,
            [id, first_name, last_name, age]
        );
        return result.rows[0];
    },
    
    async deleteUser(id) {
        const result = await pool.query(
            `DELETE FROM users WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }
};

module.exports = UserModel;