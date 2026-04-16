// практика #19
const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');

router.post('/', async (req, res) => {
    try {
        const newUser = await UserModel.createUser(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error on creating new user" });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error on getting users" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await UserModel.getById(req.params.id);

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error on getting user" });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedUser = await UserModel.updateUser(req.params.id, req.body);

        if (!updatedUser) {
            return res.status(404).json({error: "User not found"});
        }

        res.status(201).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error on patching user" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await UserModel.deleteUser(req.params.id);

        if (!deleted) {
            return res.status(404).json({error: "User not found"});
        }

        res.status(200).json({message: "User deleted"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error on deleting user" });
    }
});

module.exports = router;