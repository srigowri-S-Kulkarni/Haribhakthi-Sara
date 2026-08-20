-- Insert Default Administrator Account
-- Password: Admin@123 (BCrypt hashed)
INSERT INTO users (id, name, email, password_hash, role, preferred_language, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Platform Administrator',
    'admin@haribhakthi.com',
    '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07Xd0D1BPH65W1wy2S',
    'ADMIN',
    'en',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
