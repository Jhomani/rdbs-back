SET timezone = 'America/La_Paz';

CREATE TABLE IF NOT EXISTS "atm" (
  id serial PRIMARY KEY,
  name VARCHAR (100),
  address VARCHAR (255) NOT NULL,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "money" (
  id serial PRIMARY KEY,
  amount INT NOT NULL,
  quantity INT NOT NULL,
  imageuri VARCHAR (200),
  atmid INT NOT NULL,

  FOREIGN KEY (atmid) REFERENCES atm (id)
);

CREATE TABLE IF NOT EXISTS "record" (
  id serial PRIMARY KEY,
  amount INT NOT NULL,
  balance INT NOT NULL,
  userid INT NOT NULL,
  atmid INT NOT NULL,
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (atmid) REFERENCES atm (id)
);

INSERT INTO "atm"("name", "address") VALUES('La Recoleta', 'Av. Recolera entre Wold Street.');
INSERT INTO "atm"("name", "address") VALUES('America', 'Av. America entre Beigin.');

INSERT INTO "money"("amount", "quantity", "imageuri", "atmid") VALUES(10, 30, 'http://localhost:9000/images/10.png', 1);
INSERT INTO "money"("amount", "quantity", "imageuri", "atmid") VALUES(20, 10, 'http://localhost:9000/images/20.png', 1);
