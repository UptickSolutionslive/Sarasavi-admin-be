const userModel = require('../models/user-model');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
dotenv.config();

async function saveUser() {
    const { USER_NAMES, USER_PASSWORD, USER_ROLES } = process.env;

    // Splitting the comma-separated values into arrays
    const usernames = USER_NAMES.split(',');
    const passwords = USER_PASSWORD.split(',');
    const roles = USER_ROLES.split(',');
    // const userRoles = ['staff', 'admin', 'manager'];


    try {
        // Assuming same length for usernames and passwords, and they correspond to each other
        for (let i = 0; i < usernames.length; i++) {
            const existingUser = await userModel.findOne({ username: usernames[i] });
            if (existingUser) {
                console.log(`User ${usernames[i]} already exists, skipping insertion.`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(passwords[i], 10);

            const newUser = new userModel({ 
                username: usernames[i],
                password: hashedPassword,
                role: roles[i]
            });

            const result = await newUser.save();
            if (!result) {
                console.error(`Failed to save user ${usernames[i]}`);
            } else {
                console.log(`User ${usernames[i]} saved successfully.`);
            }
        }
        return { status: 200, message: "Users Saved Successfully" };
    } catch (err) {
        console.error("Error saving users:", err);
        return { status: 500, error: err };
    }
}

// Login function to authenticate user and generate token
async function login(req) {
    const {username,password} = req.body;
    
    try {
        const user = await userModel.findOne({ username: username });
        if (!user) {
            throw new Error('User not found');
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = generateToken(user.username, user.role);
        return { status: 200, message: 'Login successful', token: token };
    } catch (error) {
        console.log(error);
        return { status: 401, error: error.message };
    }
}

function generateToken(username, role) {
    const payload = {
        username: username,
        role: role
    };

    const secretKey = process.env.JWT_SECRET; 
    const options = {
        expiresIn: '1h'
    };

    return jwt.sign(payload, secretKey, options);
}


module.exports = {
    saveUser,
    generateToken,
    login
};
