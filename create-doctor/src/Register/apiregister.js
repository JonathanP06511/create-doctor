const express = require('express');
const router = express.Router();
const fetch = (...args) =>
import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { User } = require('../models');

router.post('/', async (req, res) => {
    const { role, name, lastname, specialization, email, password, phone } = req.body;
    try {
        const response = await fetch(`http://localhost:4003/apiencrypt/${email}/${password}`);
        if (response.ok) {
            const data = await response.json();
            const mail = data.mail;
            const pass = data.password;

            const newDoctor = await User.create({
                role,
                name,
                lastname,
                specialization, 
                phone,
                mail,
                password: pass,
            });

            res.status(201).json({ message: 'Doctor successfully created', doctor: newDoctor });
        } else {
            res.status(500).json({ error: "Error fetching encrypted data" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
