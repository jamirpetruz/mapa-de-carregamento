import { getHanaConnection } from "@/lib/db";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function loadLotes(numPedido: number | null, codItem: string): Promise<string[]> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T7."DistNumber" AS "LOTE"
        FROM "${HANA_DATABASE}".ITL1 T6L
        INNER JOIN "${HANA_DATABASE}".OITL T6 
            ON T6."LogEntry" = T6L."LogEntry"
            AND T6."DocType" = 17                               -- Pedido de venda
        INNER JOIN "${HANA_DATABASE}".OBTN T7 
            ON T7."ItemCode" = T6L."ItemCode" 
            AND T7."SysNumber" = T6L."SysNumber"
        INNER JOIN "${HANA_DATABASE}".RDR1 T1 
            ON T1."DocEntry" = T6."DocEntry" 
            AND T1."LineNum" = T6."DocLine"
        INNER JOIN "${HANA_DATABASE}".ORDR T0 
            ON T0."DocEntry" = T6."DocEntry"
        WHERE 
            T0."DocNum" = ? -- $[$17_U_E.1.0]                       -- Número do pedido digitado
            AND T6L."ItemCode" = ? -- $[@MAP_CAR_LIN.U_CodItem.0]   -- Código do item digitado
        ORDER BY 
            T7."DistNumber"
    `;

    return new Promise<string[]>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido, codItem],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = (res as { "LOTE": string }[])
                    .map(row => row["LOTE"]);

                resolve(items);
            }
        );
    });
}