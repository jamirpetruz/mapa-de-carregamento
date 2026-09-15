let sapSessionId: string | null = null;

export async function getSapSession(): Promise<string | null> {

    // ==========================================
    // NÃO EXISTE SESSÃO
    // ==========================================

    if (!sapSessionId) {
        await loginSap();
        return sapSessionId;
    }

    // ==========================================
    // VALIDA SESSÃO EXISTENTE
    // ==========================================

    try {

        const response = await fetch(
            `${process.env.SAP_URL}/b1s/v1/UsersInfo`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `B1SESSION=${sapSessionId}`
                }
            }
        );

        // Sessão válida
        if (response.ok) {
            return sapSessionId;
        }

        // Sessão inválida
        if (response.status === 401) {

            console.warn(
                "Sessão SAP expirada. Fazendo novo login..."
            );

            clearSapSession();

            await loginSap();

            return sapSessionId;
        }

        // Outro erro
        const text = await response.text();

        throw new Error(
            `Erro ao validar sessão SAP: ${response.status} ${text}`
        );

    } catch (error) {

        console.error(
            "Erro ao validar sessão SAP:",
            error
        );

        clearSapSession();

        await loginSap();

        return sapSessionId;
    }
}

export function setSapSession(sessionId: string) {
    sapSessionId = sessionId;
}

export function clearSapSession() {
    sapSessionId = null;
}

async function loginSap() {

    console.log("========== LOGIN SAP ==========");

    const response = await fetch(
        `${process.env.SAP_URL}/b1s/v1/Login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                CompanyDB: process.env.SAP_COMPANY_DB,
                UserName: process.env.SAP_USER,
                Password: process.env.SAP_PASSWORD
            })
        }
    );

    if (!response.ok) {

        const text = await response.text();

        throw new Error(
            `Erro ao fazer login no SAP: ${response.status} ${text}`
        );
    }

    const data = await response.json();

    setSapSession(data.SessionId);

    console.log(
        "Nova sessão SAP criada:",
        data.SessionId
    );

    return data.SessionId;
}
