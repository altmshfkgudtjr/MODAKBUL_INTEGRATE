CREATE TABLE IF NOT EXISTS user(
user_id VARCHAR(20) NOT NULL,
pw VARCHAR(150) NOT NULL,
user_name VARCHAR(10) NOT NULL,
user_color VARCHAR(20) NOT NULL DEFAULT "#D8D8D8",
PRIMARY KEY (user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;