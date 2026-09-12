import { getHanaConnection } from "@/lib/db";
import { getSapSession } from "@/lib/sap/session";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function findItemsByPedido(numPedido: number | null): Promise<string[]> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT DISTINCT
            IFNULL(T6L."ItemCode", T1."ItemCode") AS "CÓDIGO"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".RDR1 T1 
            ON T0."DocEntry" = T1."DocEntry"
        LEFT JOIN "${HANA_DATABASE}".OITL T6 
            ON T6."DocType" = 17
            AND T6."DocEntry" = T1."DocEntry"
            AND T6."DocLine" = T1."LineNum"
        LEFT JOIN "${HANA_DATABASE}".ITL1 T6L 
            ON T6L."LogEntry" = T6."LogEntry"
        WHERE T0."DocNum" = ?
        ORDER BY "CÓDIGO"
    `;

    return new Promise<string[]>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = (res as { "CÓDIGO": string }[])
                    .map(row => row["CÓDIGO"]);

                resolve(items);
            }
        );
    });
}

export async function findItemDesc(itemCode: string): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T0."ItemName" AS "descricao"
        FROM "${HANA_DATABASE}".OITM T0
        WHERE T0."ItemCode" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [itemCode],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { descricao: string }[];

                resolve(items[0]?.descricao ?? "");
            }
        );
    });
}

export async function findItemUnidade(itemCode: string): Promise<string> {
    const conn = await getHanaConnection();
    const sql = `
        SELECT
            T0. "SalUnitMsr" AS "Unidade"
            FROM "${HANA_DATABASE}".OITM T0
        WHERE T0."ItemCode" = ?
    `
    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [itemCode],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { Unidade: string }[];

                resolve(items[0]?.Unidade ?? "");
            }
        );
    });
}

export async function findQuantidade(numPedido: number | null, itemCode: string, numLote: string): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            ROUND(T6L."AllocQty", 2) AS "quantidade"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".RDR1 T1 
            ON T0."DocEntry" = T1."DocEntry"
        INNER JOIN "${HANA_DATABASE}".OITL T6 
            ON T6."DocType" = 17 
            AND T6."DocEntry" = T1."DocEntry" 
            AND T6."DocLine" = T1."LineNum"
        INNER JOIN "${HANA_DATABASE}".ITL1 T6L 
            ON T6L."LogEntry" = T6."LogEntry"
        INNER JOIN "${HANA_DATABASE}".OBTN T7 
            ON T7."ItemCode" = T6L."ItemCode" 
            AND T7."SysNumber" = T6L."SysNumber"
        WHERE 
            T0."DocNum" = ?
            AND T1."ItemCode" = ?
            AND T7."DistNumber" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido, itemCode, numLote],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { quantidade: string }[];

                resolve(items[0]?.quantidade ?? "");
            }
        );
    });
}

export async function findPreco(numPedido: number | null, itemCode: string): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            ROUND(T1."Price", 2) AS "preco"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".RDR1 T1 
            ON T0."DocEntry" = T1."DocEntry"
        WHERE 
            T0."DocNum" = ?                 
            AND T1."ItemCode" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido, itemCode],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { preco: string }[];

                resolve(items[0]?.preco ?? "");
            }
        );
    });
}

export async function findTotal(numPedido: number | null, itemCode: string, numLote: string): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            ROUND(
                SUM(IFNULL(T6L."AllocQty",0) * IFNULL(T1."Price",0))
            , 2) AS "total"
        FROM "${HANA_DATABASE}".ORDR T0
        INNER JOIN "${HANA_DATABASE}".RDR1 T1 ON T0."DocEntry" = T1."DocEntry"
        INNER JOIN "${HANA_DATABASE}".OITL T6 ON T6."DocType" = 17 
            AND T6."DocEntry" = T1."DocEntry" 
            AND T6."DocLine" = T1."LineNum"
        INNER JOIN "${HANA_DATABASE}".ITL1 T6L ON T6L."LogEntry" = T6."LogEntry"
        INNER JOIN "${HANA_DATABASE}".OBTN T7 ON T7."ItemCode" = T6L."ItemCode" 
            AND T7."SysNumber" = T6L."SysNumber"
        WHERE 
            T0."DocNum" = ?
            AND T1."ItemCode" = ?
            AND T7."DistNumber" = ?
    `;

    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido, itemCode, numLote],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { total: string }[];

                resolve(items[0]?.total ?? "");
            }
        );
    });
}