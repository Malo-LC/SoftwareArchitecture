CREATE DATABASE IF NOT EXISTS bowling_corp;
USE bowling_corp;


CREATE TABLE IF NOT EXISTS User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('agent', 'customer') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS Token (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  active BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME,
  life_time INT,
  id_user INT,
);

CREATE TABLE IF NOT EXISTS Alley (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  id_qrcode INT
);

CREATE TABLE IF NOT EXISTS QRCode (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(255),
  size INT,
  data LONGBLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS Session (
  id INT AUTO_INCREMENT PRIMARY KEY,
  active BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME,
  id_alley INT
);

CREATE TABLE IF NOT EXISTS User_Session (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT,
  id_session INT
);

CREATE TABLE IF NOT EXISTS Bill (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount FLOAT,
  is_paid BOOLEAN,
  id_user_session INT
);

CREATE TABLE IF NOT EXISTS Command (
  id INT AUTO_INCREMENT PRIMARY KEY,
  is_paid BOOLEAN,
  discount FLOAT,
  id_user_session INT,
  id_product INT
);

CREATE TABLE IF NOT EXISTS Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  price FLOAT,
  inventory INT,
  type ENUM('snak', 'soft_drink', 'alcohol', 'food')
);

ALTER TABLE Token ADD FOREIGN KEY (id_user) REFERENCES User (id);

ALTER TABLE Alley ADD FOREIGN KEY (id_qrcode) REFERENCES QRCode (id);

ALTER TABLE Session ADD FOREIGN KEY (id_alley) REFERENCES Alley (id);

ALTER TABLE User_Session ADD FOREIGN KEY (id_user) REFERENCES User (id);

ALTER TABLE User_Session ADD FOREIGN KEY (id_session) REFERENCES Session (id);

ALTER TABLE Bill ADD FOREIGN KEY (id_user_session) REFERENCES User_Session (id);

ALTER TABLE Command ADD FOREIGN KEY (id_user_session) REFERENCES User_Session (id);

ALTER TABLE Command ADD FOREIGN KEY (id_product) REFERENCES Product (id);

