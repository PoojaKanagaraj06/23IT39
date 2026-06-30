const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(__dirname, "..", "data", "users.json");

function readJsonArray(filePath) {
    const raw = fs.readFileSync(filePath, "utf8").trim();

    if (!raw) {
        return [];
    }

    return JSON.parse(raw);
}

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const users = readJsonArray(usersFile);

    const userExists = users.find(
        user => user.email === email || user.username === username
    );

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashedPassword
    };

    users.push(newUser);

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.json({
        message: "User Registered Successfully"
    });
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const users = readJsonArray(usersFile);

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(400).json({
            message: "Invalid Email"
        });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({
            message: "Invalid Password"
        });
    }

    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true
    });

    res.json({
        message: "Login Successful"
    });

});

router.post("/logout", (req, res) => {

    res.clearCookie("token");

    res.json({
        message: "Logout Successful"
    });

});

router.get("/profile", (req, res) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please Login"
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const users = readJsonArray(usersFile);

        const user = users.find(user => user.id === decoded.id);

        res.json({
            id: user.id,
            username: user.username,
            email: user.email
        });

    } catch {

        res.status(401).json({
            message: "Invalid Token"
        });

    }

});

module.exports = router;