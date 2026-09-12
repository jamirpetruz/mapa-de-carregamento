import { getHanaConnection } from "@/lib/db";
import { INotaSaida } from "@/types/NotaSaida";
import { INotaSaidaLine } from "@/types/NotaSaidaLine";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function findNotaSaida(docNum: number) {
    const conn = await getHanaConnection()
    const sql = `
        SELECT DISTINCT
            T0."DocNum",
            T0."CardCode",
            T0."CardName",
            T0."DocStatus",
            T0."DocDate",
            T0."DocDueDate",
            T0."DocCur",
            T0."DocTotal",
            T0."DocTotalFC",
            T1."BPLName" AS "Filial"
        FROM "${HANA_DATABASE}".OINV T0
        INNER JOIN "${HANA_DATABASE}".OBPL T1
            ON T0."BPLId" = T1."BPLId"
        INNER JOIN "${HANA_DATABASE}".INV1 T2
            ON T0."DocEntry" = T2."DocEntry"
        INNER JOIN "${HANA_DATABASE}".ORDR T3
            ON T2."BaseType" = 17
            AND T2."BaseEntry" = T3."DocEntry"
        WHERE T3."DocNum" = ?
            AND T0."CANCELED" = 'N'
    `

    return new Promise<INotaSaida>((resolve, reject) => {
        conn.execute(
            sql,
            [docNum],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as INotaSaida[];

                resolve(items[0] ?? {
                    CardCode: "",
                    CardName: "",
                    DocCur: "",
                    DocDate: "",
                    DocDueDate: "",
                    DocNum: "",
                    DocStatus: "",
                    Filial: ""
                });
            }
        );
    });
}
// PROBLEMA LINHAS DUPLICADAS
export async function findNotaSaidaLines(numPedido: number): Promise<INotaSaidaLine[]> {
    const conn = await getHanaConnection()
    const sql = `
    SELECT DISTINCT
        T2."ItemCode",
        T2."Quantity",
        T2."PriceBefDi",
        T2."DiscPrcnt",
        T2."Usage",
        T2."CFOPCode",
        T2."LineTotal",
        T2."LineNum"
    FROM "${HANA_DATABASE}".ORDR T0
    INNER JOIN "${HANA_DATABASE}".INV1 T2 
        ON T2."BaseEntry" = T0."DocEntry"
        AND T2."BaseType" = 17
    INNER JOIN "${HANA_DATABASE}".OINV T1 
        ON T1."DocEntry" = T2."DocEntry"
    WHERE T0."DocNum" = ?
    ORDER BY
        T2."LineNum";
    `

    return new Promise<INotaSaidaLine[]>((resolve, reject) => {
        conn.execute(
            sql,
            [numPedido],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as INotaSaidaLine[];

                resolve(items);
            }
        );
    });
}