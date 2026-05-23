-- Add password column (if not exists)
ALTER TABLE system_user 
ADD COLUMN password VARCHAR(255);

-- set password for Alice
UPDATE system_user
SET password = '$2b$10$jaLQ02q8Entdy79JZQUIduiV8FE.Tx2VLkwojZFf0z.8U2hhFnOZC'
WHERE email = 'alice@acme.com';

-- fix missing passwords 
UPDATE system_user
SET password = NULL
WHERE password = '';