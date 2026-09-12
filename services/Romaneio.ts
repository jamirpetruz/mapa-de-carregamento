import { getHanaConnection, pgPool } from "@/lib/db"
import { IMapaCarregamento } from "@/types/MapaDeCarregamento";
import { IRomaneio } from "@/types/Romaneio"

const HANA_DATABASE = process.env.HANA_DATABASE

export async function findRomaneiosByDates(dataInicial: string, dataFinal: string): Promise<IRomaneio[]> {
    const conn = await getHanaConnection()
    const sql = `
SELECT
    T0."Code",
    T0."U_Data",
    T0."U_NPedido",
    L."U_Invoice",
    L."U_CardName",
    Totais."Total_Geral",
    L."U_Cidade",
    L."U_Pais",
    L."U_Bairro",
    L."U_Cep",
    L."U_Rua",
    Totais."Palet_Geral",
    Totais."Liq_Geral",
    Totais."Bru_Geral",
    T0."U_Veiculo",
    T0."U_Placa",
    T0."U_Transport",
    T0."U_Motorista",
    T0."U_Lacre",
    T0."U_DataLog",
    Totais."Quant_Geral",
    Totais."U_NPalet"

FROM "${HANA_DATABASE}"."@MAP_CAR_CAB" T0

INNER JOIN
(
    -- Seleciona apenas uma linha representativa por documento
    SELECT
        T1."Code",
        MAX(TO_NVARCHAR(T1."U_Invoice")) AS "U_Invoice",
        MAX(TO_NVARCHAR(T1."U_CardName")) AS "U_CardName",
        MAX(TO_NVARCHAR(T1."U_Cidade")) AS "U_Cidade",
        MAX(TO_NVARCHAR(T1."U_Pais")) AS "U_Pais",
        MAX(TO_NVARCHAR(T1."U_Bairro")) AS "U_Bairro",
        MAX(TO_NVARCHAR(T1."U_Cep")) AS "U_Cep",
        MAX(TO_NVARCHAR(T1."U_Rua")) AS "U_Rua"
    FROM "${HANA_DATABASE}"."@MAP_CAR_LIN" T1
    GROUP BY T1."Code"
) L
    ON T0."Code" = L."Code"

INNER JOIN
(
    -- Totais por documento
    SELECT
        T2."Code",
        SUM(T2."U_Total") AS "Total_Geral",
        SUM(T2."U_PPalet") AS "Palet_Geral",
        SUM(T2."U_PLiq") AS "Liq_Geral",
        SUM(T2."U_PBru") AS "Bru_Geral",
        SUM(T2."U_Quant") AS "Quant_Geral",
        COUNT(*) AS "U_NPalet"
    FROM "${HANA_DATABASE}"."@MAP_CAR_LIN" T2
    GROUP BY T2."Code"
) Totais
    ON T0."Code" = Totais."Code"

WHERE T0."U_Data" >= ?
  AND T0."U_Data" <= ?
        `

    return new Promise<IRomaneio[]>((resolve, reject) => {
        conn.execute(
            sql,
            [dataInicial, dataFinal],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = (res as IRomaneio[])
                console.log(items)
                resolve(items);
            }
        );
    });
}