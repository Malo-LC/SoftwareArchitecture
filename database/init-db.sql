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

CREATE TABLE IF NOT EXISTS Alley (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  is_used BOOLEAN DEFAULT FALSE,
  qrcode INT,
  id_park INT
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
  id_alley INT,
  qrCode
);

CREATE TABLE IF NOT EXISTS User_Session (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT,
  id_session INT
);

CREATE TABLE IF NOT EXISTS Bill (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amount FLOAT,
  remaining FLOAT,
  is_paid BOOLEAN,
  id_user_session INT
);

CREATE TABLE IF NOT EXISTS Park (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  address VARCHAR(255)
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
  park_id INT,
  type ENUM('snak', 'soft_drink', 'alcohol', 'food')
);

ALTER TABLE
  Alley
ADD
  FOREIGN KEY (qrcode) REFERENCES QRCode (id);

ALTER TABLE
  Session
ADD
  FOREIGN KEY (id_alley) REFERENCES Alley (id);

ALTER TABLE
  User_Session
ADD
  FOREIGN KEY (id_user) REFERENCES User (id);

ALTER TABLE
  User_Session
ADD
  FOREIGN KEY (id_session) REFERENCES Session (id);

ALTER TABLE
  Bill
ADD
  FOREIGN KEY (id_user_session) REFERENCES User_Session (id);

ALTER TABLE
  Command
ADD
  FOREIGN KEY (id_user_session) REFERENCES User_Session (id);

ALTER TABLE
  Command
ADD
  FOREIGN KEY (id_product) REFERENCES Product (id);

INSERT INTO
  User (username, email, password, role)
VALUES
  (
    'admin',
    'admin@localhost.com',
    '$2a$10$YtAOT35VFO1dWZFYh.teIuG8drh2mIed73FHrAzH7uqpp9HykMqmm',
    'agent'
  );

INSERT INTO
  Park (name, address)
VALUES
  (
    'Bowling Corp',
    '123 Rue des lilas, 75020 Paris, France'
  );

INSERT INTO
  QRCode (type, size, data)
VALUES
  ('alley', 100, 'QRCODE');

INSERT INTO
  Alley (name, qrcode, id_park)
VALUES
  ('Alley 1', 1, 1);

INSERT INTO
  Product (name, price, inventory, type, park_id)
VALUES
  ('Coca Cola', 2.5, 100, 'soft_drink', 1),
  ('Pepsi', 2.5, 100, 'soft_drink', 1),
  ('Fanta', 2.5, 100, 'soft_drink', 1),
  ('Sprite', 2.5, 100, 'soft_drink', 1),
  ('7up', 2.5, 100, 'soft_drink', 1),
  ('Heineken', 3.5, 100, 'alcohol', 1),
  ('Tiger', 3.5, 100, 'alcohol', 1),
  ('Saigon', 3.5, 100, 'alcohol', 1),
  ('Budweiser', 3.5, 100, 'alcohol', 1);