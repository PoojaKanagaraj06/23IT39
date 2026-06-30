const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const notificationsFile = path.join(__dirname, "..", "data", "notifications.json");

router.post("/", (req, res) => {

    const notifications = JSON.parse(
        fs.readFileSync(notificationsFile, "utf8")
    );

    const newNotification = {
        id: Date.now().toString(),
        eventId: req.body.eventId,
        senderSystem: req.body.senderSystem,
        category: req.body.category,
        recipients: req.body.recipients,
        templateId: req.body.templateId,
        templateData: req.body.templateData,
        status: "Pending"
    };

    notifications.push(newNotification);

    fs.writeFileSync(
        notificationsFile,
        JSON.stringify(notifications, null, 2)
    );

    res.json({
        message: "Notification Created",
        notification: newNotification
    });

});

router.get("/", (req, res) => {

    const notifications = JSON.parse(
        fs.readFileSync(notificationsFile, "utf8")
    );

    res.json(notifications);

});

router.get("/:id", (req, res) => {

    const notifications = JSON.parse(
        fs.readFileSync(notificationsFile, "utf8")
    );

    const notification = notifications.find(
        n => n.id === req.params.id
    );

    if (!notification) {
        return res.status(404).json({
            message: "Notification Not Found"
        });
    }

    res.json(notification);

});

router.put("/:id", (req, res) => {

    const notifications = JSON.parse(
        fs.readFileSync(notificationsFile, "utf8")
    );

    const notification = notifications.find(
        n => n.id === req.params.id
    );

    if (!notification) {
        return res.status(404).json({
            message: "Notification Not Found"
        });
    }

    notification.status = req.body.status;

    fs.writeFileSync(
        notificationsFile,
        JSON.stringify(notifications, null, 2)
    );

    res.json({
        message: "Status Updated",
        notification
    });

});

module.exports = router;