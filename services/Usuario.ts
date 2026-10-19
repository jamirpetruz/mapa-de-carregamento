import { getSQLServerPool } from "@/lib/db";
import { IUsuario } from "@/types/Usuario";
import bcrypt from "bcrypt";
import sql from "mssql";

export async function findAllUsuarios(): Promise<IUsuario[]> {
    const pool = await getSQLServerPool();

    const query = `
        SELECT
            userId,
            username,
            name,
            email,
            password,
            ativo,
            role,
            createdAt
        FROM dbo.Users
        ORDER BY name
    `;

    const result = await pool.request().query(query);

    return result.recordset as IUsuario[];
}

export async function findUsuarioByEmail(
    email: string
): Promise<IUsuario | null> {
    const pool = await getSQLServerPool();

    const result = await pool
        .request()
        .input("email", sql.VarChar(150), email)
        .query(`
            SELECT
                userId,
                username,
                name,
                email,
                password,
                ativo,
                role,
                createdAt
            FROM dbo.Users
            WHERE email = @email
        `);

    return (result.recordset[0] as IUsuario) ?? null;
}

export async function createUsuario(
    user: IUsuario
): Promise<IUsuario> {
    const pool = await getSQLServerPool();

    const passwordHash = await bcrypt.hash(user.password, 10);

    const result = await pool
        .request()
        .input("username", sql.VarChar(100), user.username)
        .input("name", sql.VarChar(150), user.name)
        .input("email", sql.VarChar(150), user.email)
        .input("password", sql.VarChar(255), passwordHash)
        .input("ativo", sql.Bit, user.ativo ?? true)
        .input("role", sql.VarChar(20), user.role || "user")
        .query(`
            INSERT INTO dbo.Users (
                username,
                name,
                email,
                password,
                ativo,
                role,
                createdAt
            )
            OUTPUT
                INSERTED.userId,
                INSERTED.username,
                INSERTED.name,
                INSERTED.email,
                INSERTED.ativo,
                INSERTED.role,
                INSERTED.createdAt
            VALUES (
                @username,
                @name,
                @email,
                @password,
                @ativo,
                @role,
                SYSDATETIME()
            )
        `);

    return result.recordset[0] as IUsuario;
}

export async function updateUsuario(
    user: IUsuario
): Promise<boolean> {
    const pool = await getSQLServerPool();

    try {
        const request = pool.request();

        request.input("userId", sql.Int, user.userId);
        request.input("username", sql.VarChar(100), user.username);
        request.input("name", sql.VarChar(150), user.name);
        request.input("email", sql.VarChar(150), user.email);
        request.input("ativo", sql.Bit, user.ativo);
        request.input("role", sql.VarChar(20), user.role);

        let passwordSql = "";

        if (user.password) {
            const passwordHash = await bcrypt.hash(user.password, 10);

            request.input("password", sql.VarChar(255), passwordHash);
            passwordSql = ", password = @password";
        }

        await request.query(`
            UPDATE dbo.Users
            SET
                username = @username,
                name = @name,
                email = @email,
                ativo = @ativo,
                role = @role
                ${passwordSql}
            WHERE userId = @userId
        `);

        return true;
    } catch (error) {
        console.error("Falha ao atualizar usuário:", error);
        return false;
    }
}