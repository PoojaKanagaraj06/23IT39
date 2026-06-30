require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const notificationRoutes = require("./routes/notification");

const app = express();
const deploymentPrefix = "/evaluation-service";

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use(`${deploymentPrefix}/auth`, authRoutes);
app.use(`${deploymentPrefix}/notification`, notificationRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});