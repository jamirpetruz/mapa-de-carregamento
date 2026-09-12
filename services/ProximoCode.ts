import { getHanaConnection } from "@/lib/db";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function proximoCode(): Promise<string>{
    const conn = await getHanaConnection();
    const sql = `
    SELECT 
        LPAD(
            TO_VARCHAR(IFNULL(MAX(CAST("Code" AS INTEGER)), 0) + 1),
            4,
            '0'
        ) AS "ProximoCode"
    FROM "${HANA_DATABASE}"."@MAP_CAR_CAB" T0;
    `
    return new Promise<string>((resolve, reject) => {
        conn.execute(
            sql,
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as { ProximoCode: string }[];

                resolve(items[0].ProximoCode);
            }
        );
    });
}