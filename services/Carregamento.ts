import { getHanaConnection } from "@/lib/db";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function findPesoReferencia(itemCode: string): Promise<number> {
    const conn = await getHanaConnection();

    const sql = `
            SELECT DISTINCT
                T0."SWeight1" AS "pesoRef"
            FROM "${HANA_DATABASE}".OITM T0
                WHERE T0."ItemCode" = ?
        `;

    return new Promise<number>((resolve, reject) => {
        conn.execute(
            sql,
            [itemCode],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { pesoRef: number }[];

                resolve(items[0]?.pesoRef ?? 0);
            }
        );
    });
}

export async function findPesos(
    pesoPalet: number,
    pesoReferencia: number,
    numPedido: number | null,
    itemCode: string,
    numLote: string
): Promise<{ pesoLiquido: number, pesoBruto: number }> {
    const conn = await getHanaConnection();
    console.log(`PESO DO PALLET: ${pesoPalet}`)
    console.log(`${pesoPalet}, ${pesoReferencia}, ${numPedido}, ${itemCode}, ${numLote}`)
    const sql = `
    SELECT 
        ROUND(
            IFNULL(CAST(? AS DECIMAL(19,6)), 0)
            + IFNULL(T6L."AllocQty", 0) 
                * IFNULL(CAST(? AS DECIMAL(19,6)), 0),
            2
        ) AS "pesoBruto",

        ROUND(
            IFNULL(T6L."AllocQty", 0) 
                * IFNULL(CAST(? AS DECIMAL(19,6)), 0),
            2
        ) AS "pesoLiquido"

    FROM "${HANA_DATABASE}".ORDR T0

    INNER JOIN ${HANA_DATABASE}.RDR1 T1 
        ON T0."DocEntry" = T1."DocEntry"

    INNER JOIN ${HANA_DATABASE}.OITL T6 
        ON T6."DocType" = 17 
        AND T6."DocEntry" = T1."DocEntry" 
        AND T6."DocLine" = T1."LineNum"

    INNER JOIN ${HANA_DATABASE}.ITL1 T6L 
        ON T6L."LogEntry" = T6."LogEntry"

    INNER JOIN ${HANA_DATABASE}.OBTN T7 
        ON T7."ItemCode" = T6L."ItemCode" 
        AND T7."SysNumber" = T6L."SysNumber"
    WHERE 
        T0."DocNum" = ?
        AND T1."ItemCode" = ?
        AND T7."DistNumber" = ?
`
    return new Promise<{ pesoLiquido: number, pesoBruto: number }>((resolve, reject) => {
        conn.execute(
            sql,
            [pesoPalet, pesoReferencia, pesoReferencia, numPedido, itemCode, numLote],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { pesoLiquido: number, pesoBruto: number }[];

                resolve(items[0] ?? { pesoLiquido: 0, pesoBruto: 0 });
            }
        );
    });
}

export async function findDeposito(numPedido: number | null): Promise<string> {
    const conn = await getHanaConnection();

    const sql = `
            SELECT 
                T1."WhsCode" AS "deposito"
            FROM ${HANA_DATABASE}.ORDR T0
            INNER JOIN ${HANA_DATABASE}.RDR1 T1 
                ON T0."DocEntry" = T1."DocEntry"
            WHERE 
                T0."DocNum" = ?-- $[$17_U_E.1.0]  -- Número do pedido digitado
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

                const items = res as { deposito: string }[];

                resolve(items[0]?.deposito ?? "");
            }
        );
    });
}