
-- postgres
CREATE TABLE "@MAP_CAR_CAB" (
    "Code" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    "Veiculo" VARCHAR(100),
    "NPedido" NUMERIC(11, 0),
    "Placa" VARCHAR(10),
    "Lacre" VARCHAR(20),
    "Motorista" VARCHAR(150),
    "DataLog" VARCHAR(20),
    "Transport" VARCHAR(150),
    "Cubagem" VARCHAR(10),
    "OBS" TEXT,
    "Data" DATE,

    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- postgres
CREATE TABLE "@MAP_CAR_LIN" (
    "Code" INT NOT NULL,

    "U_CodItem" VARCHAR(10) NOT NULL,
    "U_Lote" VARCHAR(10) NOT NULL,
    "U_Invoice" VARCHAR(10) NOT NULL,
    "U_CodClient" VARCHAR(10) NOT NULL,
    "U_CardName" TEXT NOT NULL,
    "U_DescItem" TEXT NOT NULL,
    "U_Unidade" VARCHAR(10) NOT NULL,

    "U_Quant" NUMERIC(19, 6) NOT NULL,
    "U_Preco" NUMERIC(19, 6) NOT NULL,
    "U_Total" NUMERIC(19, 6) NOT NULL,

    "U_Fabric" DATE NOT NULL,
    "U_Validade" DATE NOT NULL,

    "U_Cidade" TEXT NOT NULL,
    "U_Pais" TEXT NOT NULL,
    "U_Bairro" TEXT NOT NULL,
    "U_Cep" NUMERIC(10, 0) NOT NULL,
    "U_Rua" TEXT NOT NULL,

    "U_Deposito" NUMERIC(10, 0) NOT NULL,

    "U_PPalet" NUMERIC(19, 6) NOT NULL,
    "U_PRef" NUMERIC(19, 6) NOT NULL,
    "U_PLiq" NUMERIC(19, 6) NOT NULL,
    "U_PBru" NUMERIC(19, 6) NOT NULL,
    "U_NPalet" NUMERIC(10, 0) NOT NULL,

    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_map_car_lin_cab
        FOREIGN KEY (Code)
        REFERENCES "@MAP_CAR_CAB"(Code)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
-- postgres
CREATE TYPE ROLE AS ENUM('admin', 'user')
CREATE TABLE "usuarios" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nome" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "role" ROLE NOT NULL,
    "status" INT NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "logs" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "acao" VARCHAR(200) NOT NULL,
    "usuario_id" VARCHAR(200) NOT NULL,
    "entidade" VARCHAR(200) NOT NULL,
    "entidade_id" VARCHAR(10) NOT NULL,
    "data_hora" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);