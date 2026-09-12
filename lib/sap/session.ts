let sapSessionId: string | null = null;

export async function getSapSession() {
    if(!sapSessionId){
        await loginSap()
    }
    return sapSessionId;
}

export function setSapSession(sessionId: string) {
    sapSessionId = sessionId;
}

export function clearSapSession() {
    sapSessionId = null;
}


async function loginSap() {

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
    )

    if (!response.ok) {
        throw new Error("Erro ao fazer login no SAP")
    }

    const data = await response.json()

    setSapSession(data.SessionId)

    return data.SessionId
}