import hanaClient from "@sap/hana-client";
import sql from 'mssql'
import bcrypt from 'bcrypt'

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

export async function getSQLServerPool(): Promise<sql.ConnectionPool> {

    const sqlConfig: sql.config = {
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        database: process.env.SQL_DATABASE,
        port: Number(process.env.SQL_PORT),
        server: process.env.SQL_SERVER!,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            trustServerCertificate: true
        }
    }
    try {
        const pool = await sql.connect(sqlConfig)
        return pool
    } catch (error) {
        console.log(error)
        throw error
    }
}