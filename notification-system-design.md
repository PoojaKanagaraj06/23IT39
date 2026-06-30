# Notification System Design

## Stage 2
PostgreSQL is the best fit for notification storage because it supports reliable relational data and JSONB payloads.
Use tables for users, notification_templates, notifications, and notification_recipients.
Core fields: ids, event_id, category, sender_system, status, template_data, is_read, delivered_at, read_at, timestamps.
Add indexes on notifications(event_id), notifications(category), notifications(status), and notification_recipients(user_id, is_read).

## Stage 3
SELECT * is not efficient because it retrieves all columns, even when only a few are needed.
Fetch only the required columns to improve performance.
The query is slow because the table contains millions of records.
Create an index on studentID, isRead, and createdAt to make filtering and sorting faster.
Avoid creating indexes on every column because too many indexes slow down insert, update, and delete operations.
Create indexes only on columns that are frequently searched or sorted.
To get placement notifications from the last 7 days, filter by notificationType = 'Placement' and createdAt within the last 7 days.

## Stage 4
Fetching notifications on every page load increases database load.
Use caching to store frequently accessed notifications.
Load notifications after the page has loaded to improve user experience.
Use pagination to load only a limited number of notifications at a time.
Use indexes to make queries faster.
A read replica can handle read requests and reduce load on the main database.
