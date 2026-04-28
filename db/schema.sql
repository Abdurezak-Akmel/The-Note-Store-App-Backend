-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- INDEX (for performance)
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);