import { pgPool } from "@/lib/db";
import { IUsuario } from "@/types/Usuario";
import bcrypt from 'bcrypt'
/**
 * 
 * POSTGRES 
 * 
 */

export async function findAllUsuarios(): Promise<IUsuario[]> {
    const conn = await pgPool.connect();

    try {
        const query = "SELECT * FROM usuarios";
        const result = await conn.query(query);
        return result.rows as IUsuario[];
    } catch (error) {
        console.error("Erro ao buscar usuários: ", error);
        throw error;
    } 
    finally {
        conn.release();
    }
}

export async function findUsuarioByEmail(email: string): Promise<IUsuario | null> {
    const conn = await pgPool.connect();

    try {
        const query = "SELECT * FROM usuarios WHERE email = $1";
        const result = await conn.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.error("Erro ao buscar usuário por email:", error);
        throw error;
    } 
    finally {
        conn.release();
    }
}

export async function createUsuario(user: IUsuario){
    const conn = await pgPool.connect()
    try {
        const passwordHash = await bcrypt.hash(user.password, 10)
        const sql = `
            INSERT INTO usuarios(
                nome, 
                email, 
                password, 
                role, 
                status
            )
            VALUES(
                $1, 
                $2, 
                $3, 
                $4, 
                $5
            )

            RETURNING
                id,
                nome,
                email,
                role,
                status
        `
        
        const result = await conn.query(sql, [
            user.nome,
            user.email,
            passwordHash,
            user.role,
            user.status
        ])
        return result.rows[0] as IUsuario
    } catch (error) {
        throw error
    } finally{
        conn.release()
    }
}

export async function updateUsuario(user: IUsuario): Promise<boolean> {
    const conn = await pgPool.connect();

    try {
        const fields: string[] = [
            'nome = $1',
            'email = $2',
            'role = $3',
            'status = $4',
        ];

        const values: any[] = [
            user.nome,
            user.email,
            user.role,
            user.status,
        ];

        if (user.password) {
            const passwordHash = await bcrypt.hash(user.password, 10);

            fields.push(`password = $${values.length + 1}`);
            values.push(passwordHash);
        }

        values.push(user.id);

        const sql = `
            UPDATE usuarios
            SET ${fields.join(', ')}
            WHERE id = $${values.length}
        `;

        await conn.query(sql, values);
        return true
    } catch (error) {
        console.log(`Falha ao atualizar usuário: ${error}`);
        return false
        throw error;
    } finally {
        conn.release();
    }
}