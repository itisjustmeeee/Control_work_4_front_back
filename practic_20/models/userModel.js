const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const userModel = {
    async createUser(user) {
        const newUser = await User.create(user);
        return newUser;
    },

    async getAll() {
        return await User.find();
    },

    async getUser(id) {
        return await User.findById(id);
    },

    async updateUser(id, data) {
        return await User.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    },

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
};

module.exports = userModel;
// запускать (на всякий случай) сначала mongosh