-- 刪除索引
DROP INDEX IF EXISTS idx_power_usage_records_timestamp;
DROP INDEX IF EXISTS idx_power_usage_records_device_id;
DROP INDEX IF EXISTS idx_devices_device_id;
DROP INDEX IF EXISTS idx_devices_user_id;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;

-- 刪除表
DROP TABLE IF EXISTS power_usage_records;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS users;