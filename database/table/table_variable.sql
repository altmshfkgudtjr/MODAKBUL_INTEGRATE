CREATE TABLE IF NOT EXISTS variable(
v_key VARCHAR(30) NOT NULL,
value VARCHAR(10000) NOT NULL,
PRIMARY KEY (v_key)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;