import { getSQLServerPool } from "@/lib/db";
import { ILog } from "@/types/Log";
import sql from "mssql";

export async function registerLog(log: ILog): Promise<void> {
    const db = await getSQLServerPool();

    try {
        const request = db.request();

        request.input("acao", sql.NVarChar, log.acao);
        request.input("usuarioId", sql.Int, log.usuarioId);
        request.input("entidade", sql.NVarChar, log.entidade);
        request.input("entidadeId", sql.VarChar, log.entidadeId);

        const query = `
        INSERT INTO dbo.Logs (acao, usuarioId, entidade, entidadeId)
        VALUES (@acao, @usuarioId, @entidade, @entidadeId)
    `;

        await request.query(query);
    } catch (error) {
        console.log(error)
    } finally {
        await db.close()
    }

}

export async function findLogsBetweenDates(
    dataInicial: string,
    dataFinal: string
): Promise<ILog[]> {
    const db = await getSQLServerPool();

    try {
        const request = db.request();

        request.input("dataInicial", sql.DateTime2, dataInicial);
        request.input("dataFinal", sql.DateTime2, dataFinal);

        const query = `
        SELECT *
        FROM dbo.Logs
        WHERE dataHora >= @dataInicial
          AND dataHora < @dataFinal
        ORDER BY dataHora DESC
    `;

        const result = await request.query(query);

        return result.recordset as ILog[];
    } catch (error) {
        console.log(error)
        return []

    } finally {
        await db.close()
    }

}