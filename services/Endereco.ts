import { getHanaConnection } from "@/lib/db";
import { IEndereco } from "@/types/Endereco";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function findEndereco(numPedido: number | null): Promise<IEndereco> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT IFNULL(T3."Name", T2."County") AS "pais", 
            T2."City" AS "cidade", 
            T2."Block" AS "bairro", 
            T2."Street" AS "rua", 
            T2."ZipCode" AS "cep" FROM "${HANA_DATABASE}".ORDR T0  
        INNER JOIN "${HANA_DATABASE}".OCRD T1 ON T0."CardCode" = T1."CardCode" 
        LEFT JOIN "${HANA_DATABASE}".CRD1 T2 ON T1."CardCode" = T2."CardCode" AND T2."AdresType" = 'S'
        LEFT JOIN "${HANA_DATABASE}".OCRY T3 ON T2."Country" = T3."Code" 
            WHERE T0."DocNum" = ?
    `
        return new Promise<IEndereco>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { pais: string; cidade: string; bairro: string; rua: string; cep: string }[];

                resolve(items[0] ?? { pais: "", cidade: "", bairro: "", rua: "", cep: "" });
            }
        );
    });
}

export async function findPais(numPedido: number | null): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            IFNULL(T4."Name", T3."Country") AS "pais"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".OCRD T2 
            ON T0."CardCode" = T2."CardCode"
        LEFT JOIN "${HANA_DATABASE}".CRD1 T3 
            ON T2."CardCode" = T3."CardCode" 
            AND T3."AdresType" = 'S'   -- Endereço de entrega
        LEFT JOIN "${HANA_DATABASE}".OCRY T4 
            ON T3."Country" = T4."Code"  -- Liga o código do país ao nome
        WHERE 
            T0."DocNum" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { pais: string }[];

                resolve(items[0]?.pais ?? "");
            }
        );
    });
}
export async function findCidade(numPedido: number | null): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T3."City" AS "cidade"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".OCRD T2 
            ON T0."CardCode" = T2."CardCode"
        LEFT JOIN "${HANA_DATABASE}".CRD1 T3 
            ON T2."CardCode" = T3."CardCode" 
            AND T3."AdresType" = 'S'   -- Endereço de entrega
        WHERE 
            T0."DocNum" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { cidade: string }[];

                resolve(items[0]?.cidade ?? "");
            }
        );
    });
}
export async function findBairro(numPedido: number | null): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T3."Block" AS "bairro"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".OCRD T2 
            ON T0."CardCode" = T2."CardCode"
        LEFT JOIN "${HANA_DATABASE}".CRD1 T3 
            ON T2."CardCode" = T3."CardCode" 
            AND T3."AdresType" = 'S'   -- Endereço de entrega
        WHERE 
            T0."DocNum" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { bairro: string }[];

                resolve(items[0]?.bairro ?? "");
            }
        );
    });
}
export async function findCep(numPedido: number | null): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T3."ZipCode" AS "cep"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".OCRD T2 
            ON T0."CardCode" = T2."CardCode"
        LEFT JOIN "${HANA_DATABASE}".CRD1 T3 
            ON T2."CardCode" = T3."CardCode" 
            AND T3."AdresType" = 'S'   -- Endereço de entrega
        WHERE 
            T0."DocNum" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { cep: string }[];

                resolve(items[0]?.cep ?? "");
            }
        );
    });
}
export async function findRua(numPedido: number | null): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T3."Street" AS "rua"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".OCRD T2 
            ON T0."CardCode" = T2."CardCode"
        LEFT JOIN "${HANA_DATABASE}".CRD1 T3 
            ON T2."CardCode" = T3."CardCode" 
            AND T3."AdresType" = 'S'   -- Endereço de entrega
        WHERE 
            T0."DocNum" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { rua: string }[];

                resolve(items[0]?.rua ?? "");
            }
        );
    });
}