## Notification App Backend
## Stage 2
PostgreSQL is the best fit for notification storage because it supports reliable relational data and JSONB payloads.
Use tables for users, notification_templates, notifications, and notification_recipients.
Core fields: ids, event_id, category, sender_system, status, template_data, is_read, delivered_at, read_at, timestamps.
Add indexes on notifications(event_id), notifications(category), notifications(status), and notification_recipients(user_id, is_read).
`POST /api/notifications` creates a notification, `GET /api/notifications` lists them, and `PUT /api/notifications/:id` updates status.
Use keyset pagination, read replicas, and partitioning or archiving as data grows.
Publish an event after each write and deliver it to clients with WebSockets or Server-Sent Events.
Offline users still receive the notification from the database when they reconnect.