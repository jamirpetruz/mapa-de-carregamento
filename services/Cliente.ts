import { getHanaConnection } from "@/lib/db";

const HANA_DATABASE = process.env.HANA_DATABASE

/* 
    Analisar a possibilidade de fazer so 1 query e trazer o invoice
*/

export async function findClientePedido(numPedido: number | null, itemCode: string, numLote: string): Promise<IClientePedido> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T2."CardName" AS "nomeCliente",
            T0."CardCode" AS "codCliente",
            T0."NumAtCard" AS "invoice"
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
        INNER JOIN "${HANA_DATABASE}".OCRD T2 
            ON T0."CardCode" = T2."CardCode"
        WHERE 
            T0."DocNum" = ?
            AND T1."ItemCode" = ?
            AND T7."DistNumber" = ?
    `;

    return new Promise<IClientePedido>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido, itemCode, numLote],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as IClientePedido[];

                resolve(items[0] ?? { nomeCliente: "", codCliente: "", invoice: "" });
            }
        );
    });
}