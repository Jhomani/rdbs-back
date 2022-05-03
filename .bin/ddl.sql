SET timezone = 'America/La_Paz';

CREATE TABLE IF NOT EXISTS "Alumno" (
  "ci" serial PRIMARY KEY,
  "nom" VARCHAR (100) NOT NULL,
  "sexo" VARCHAR (10) NOT NULL,
  "direc" VARCHAR (200) NOT NULL,
  "fec_nac" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Carrera" (
  "sigla" serial PRIMARY KEY,
  "nom" VARCHAR (100) NOT NULL,
  "descrip" VARCHAR (100) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Materia" (
  "sigla" serial PRIMARY KEY,
  "nom" VARCHAR (100) NOT NULL,
  "descrip" VARCHAR (100) NOT NULL,
  "nivel" INTEGER NOT NULL,
  "creditos" VARCHAR (200) NOT NULL,
  "area" VARCHAR (50) NOT NULL,
  "sigla_car" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  FOREIGN KEY ("sigla_car") REFERENCES "Carrera" ("sigla")
);


CREATE TABLE IF NOT EXISTS "Nota" (
  "ci" INTEGER NOT NULL,
  "sigla" INTEGER NOT NULL,
  "gestion" VARCHAR (20) NOT NULL,
  "calif" INTEGER NOT NULL,

  FOREIGN KEY ("ci") REFERENCES "Alumno" ("ci")
  FOREIGN KEY ("sigla") REFERENCES "Materia" ("sigla")
);

-- INSERT INTO "atm"("name", "address") VALUES('La Recoleta', 'Av. Recolera entre Wold Street.');
-- INSERT INTO "atm"("name", "address") VALUES('America', 'Av. America entre Beigin.');

-- INSERT INTO "money"("amount", "quantity", "imageuri", "atmid") VALUES(10, 30, 'http://localhost:9000/images/10.png', 1);
-- INSERT INTO "money"("amount", "quantity", "imageuri", "atmid") VALUES(20, 10, 'http://localhost:9000/images/20.png', 1);

-- SELECT ci, nom, avg(calif) FROM Alumno A, Nota N
--   WHERE
--     A.ci = N.ci AND
--     ci IN (SELECT ci HAVING count(DISTINCT sigla_mat) > @cant_mat)
--   GROUP BY ci, nom;
