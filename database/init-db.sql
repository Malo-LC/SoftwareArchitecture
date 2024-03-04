CREATE DATABASE IF NOT EXISTS bowling_corp;
USE bowling_corp;


CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY,
  username VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Track (
  id INTEGER PRIMARY KEY,
  name VARCHAR,
  id_qrcode INTEGER
);

CREATE TABLE IF NOT EXISTS QRCode (
  id INTEGER PRIMARY KEY,
  type VARCHAR,
  size INTEGER,
  data LONGBLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS Session (
  id INTEGER PRIMARY KEY,
  active BOOLEAN,
  created_at TIMESTAMP,
  finished_at TIMESTAMP,
  id_track INTEGER
);

CREATE TABLE IF NOT EXISTS User_Session (
  id INTEGER PRIMARY KEY,
  id_user INTEGER,
  id_session INTEGER
);

CREATE TABLE IF NOT EXISTS Bill (
  id INTEGER PRIMARY KEY,
  amount FLOAT,
  is_paid BOOLEAN,
  id_user_session INTEGER
);

CREATE TABLE IF NOT EXISTS Order (
  id INTEGER PRIMARY KEY,
  is_paid BOOLEAN,
  discount FLOAT,
  id_user_session INTEGER,
  id_product INTEGER
);

CREATE TABLE IF NOT EXISTS Product (
  id INTEGER PRIMARY KEY,
  name VARCHAR,
  price FLOAT,
  inventory INTEGER,
  type VARCHAR
);

ALTER TABLE Track ADD FOREIGN KEY (id_qrcode) REFERENCES QRCode (id);

ALTER TABLE Track ADD FOREIGN KEY (id) REFERENCES Session (id_track);

ALTER TABLE User ADD FOREIGN KEY (id) REFERENCES User_Session (id_user);

ALTER TABLE Session ADD FOREIGN KEY (id) REFERENCES User_Session (id_session);

ALTER TABLE Bill ADD FOREIGN KEY (id_user_session) REFERENCES User_Session (id);

ALTER TABLE User_Session ADD FOREIGN KEY (id) REFERENCES Order (id_user_session);

ALTER TABLE Product ADD FOREIGN KEY (id) REFERENCES Order (id_product);
