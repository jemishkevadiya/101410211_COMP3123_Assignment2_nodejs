const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;

const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUSer = new User({ username, email, password: hashedPassword });
        await newUSer.save();

        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findone({ email });
        if (!user) {
            return res.status(400).json({ error: error.message });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '3h' });
        res.status(200).json({ token, message: 'Login successful.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const protectedRoute = async (req, res) => {
    const token = req.headers.authorization?.split('')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        res.status(200).json({ message: 'Access granted.', user: req.user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};