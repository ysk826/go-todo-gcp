CREATE DATABASE IF NOT EXISTS todoapp;
USE todoapp;

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- サンプルデータ
INSERT INTO todos (title, description, completed) VALUES
('Learn Go', 'Go言語の基礎を学ぶ', FALSE),
('Setup Docker', 'Docker環境を構築する', TRUE),
('Build Todo App', 'Todo アプリを作成する', FALSE);