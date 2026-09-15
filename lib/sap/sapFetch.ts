import {
    getSapSession,
    clearSapSession
} from "./session";

export async function sapFetch(
    url: string,
    options: RequestInit = {}
) {
    let sessionId = await getSapSession();

    if (!sessionId) {
        throw new Error("Não foi possível obter sessão SAP (B1SESSION).");
    }

    async function request(session: string) {
        const headers = new Headers(options.headers);

        headers.set("Content-Type", "application/json");
        headers.set("Cookie", `B1SESSION=${session}`);

        return fetch(url, {
            ...options,
            headers
        });
    }

    // Primeira tentativa
    let response = await request(sessionId);

    // Sessão expirada
    if (response.status === 401) {
        console.warn("Sessão SAP inválida/expirada. Renovando sessão...");

        clearSapSession();

        // Nova sessão
        sessionId = await getSapSession();

        if (!sessionId) {
            throw new Error("Não foi possível renovar sessão SAP (B1SESSION).");
        }

        // Segunda tentativa
        response = await request(sessionId);
    }

    return response;
}