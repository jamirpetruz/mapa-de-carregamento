import { pgPool } from "@/lib/db";
import { ILog } from "@/types/Log";

export async function registerLog(log: ILog): Promise<void> {
    const db = await pgPool.connect();

    try {
        const query = `
            INSERT INTO logs (acao, usuario_id, entidade, entidade_id)
            VALUES ($1, $2, $3, $4)
        `;
        await db.query(query, [log.acao, log.usuario_id, log.entidade, log.entidade_id]);
    } finally {
        db.release();
    }
}

export async function findLogsBetweenDates(dataInicial: string, dataFinal: string): Promise<ILog[]> {
    const db = await pgPool.connect();

    try {
        const query = `
            SELECT * FROM logs WHERE data_hora BETWEEN $1 AND $2
        `;
        const result = await db.query(query, [dataInicial, dataFinal]);
        return result.rows as ILog[];
    } finally {
        db.release();
    }
}