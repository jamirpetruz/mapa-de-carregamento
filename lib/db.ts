import hanaClient from "@sap/hana-client";
import { Pool } from "pg";

const connectionParams = {
    serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
    uid: process.env.HANA_USER,
    pwd: process.env.HANA_PASSWORD,
};

export function getHanaConnection(): Promise<hanaClient.Connection> {
    return new Promise((resolve, reject) => {

        const connection = hanaClient.createConnection();

        connection.connect(
            connectionParams,
            (err: any) => {

                if (err) {
                    console.error(
                        "Erro ao conectar ao SAP HANA:",
                        err
                    );

                    reject(err);
                    return;
                }

                console.log("Conectado ao SAP HANA");

                resolve(connection);
            }
        );
    });
}

export const pgPool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD
})