import { getHanaConnection } from "@/lib/db";
import { IFabricacao } from "@/types/Fabricacao";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function findFabricacao(numPedido: number | null, itemCode: string, numLote: string): Promise<IFabricacao> {
    const conn = await getHanaConnection();

    const sql = `
        SELECT 
            T7."MnfDate" AS "fabricacao",
            T7."ExpDate" AS "validade"
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
            T0."DocNum" = ?                -- Número do pedido digitado
            AND T6L."ItemCode" = ? -- $[@MAP_CAR_LIN.U_CodItem.0]   -- Código do item digitado
            AND T7."DistNumber" = ? -- $[@MAP_CAR_LIN.U_Lote.0]     -- Número do lote selecionado
    `
        return new Promise<IFabricacao>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido, itemCode, numLote],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { fabricacao: string; validade: string }[];

                resolve(items[0] ?? { fabricacao: "", validade: "" });
            }
        );
    });
}