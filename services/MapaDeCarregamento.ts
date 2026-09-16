import { getHanaConnection, pgPool } from "@/lib/db";
import { getSapSession } from "@/lib/sap/session";
import { IMapaCab } from "@/types/MapaCab";
import { IMapaCarPayload } from "@/types/MapaCarPayload";
import { IMapaCarregamento } from "@/types/MapaDeCarregamento";
import { IMapaLine } from "@/types/MapaLine";
import { IMapaLinePayload } from "@/types/MapaLinePayload";
import { registerLog } from "./Log";
import { ILog } from "@/types/Log";
import { requireAuth } from "@/lib/auth";
import { saveMapaLowDB } from "@/lib/lowdb";

const HANA_DATABASE = process.env.HANA_DATABASE

/**
 * 
 * POSTGRES 
 *  
 */

export async function saveMapaDeCarregamento(cab: IMapaCab, lines: IMapaLinePayload[], usuario_id: string): Promise<boolean> {
    if (!lines || lines.length === 0) {
        console.error("Nenhuma linha foi informada.");
        return false;
    }
    try {
        saveMapaHana(cab, lines, usuario_id)
        return true
    } catch (error) {
        return false
    }

    /*const conn = await pgPool.connect();
    const sql = `
        INSERT INTO "@MAP_CAR_CAB" (
            "Veiculo",
            "NPedido",
            "Placa",
            "Lacre",
            "Motorista",
            "DataLog",
            "Transport",
            "Cubagem",
            "OBS",
            "Data"
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
        )
        RETURNING "Code";
    `
    try {
        await conn.query('BEGIN');
        const insertCab = await conn.query(sql, [
            cab.Veiculo,
            cab.NPedido,
            cab.Placa,
            cab.Lacre,
            cab.Motorista,
            cab.DataLog,
            cab.Transport,
            cab.Cubagem,
            cab.OBS,
            cab.Data
        ]);
        console.log('Inserted cab:', insertCab.rows[0]);
        const insertedCabCode = insertCab.rows[0].Code;

        const insertLinesSql = `
        INSERT INTO "@MAP_CAR_LIN" (
            "Code",
            "U_CodItem",
            "U_Lote",
            "U_Invoice",
            "U_CodClient",
            "U_CardName",
            "U_DescItem",
            "U_Unidade",
            "U_Quant",
            "U_Preco",
            "U_Total",
            "U_Fabric",
            "U_Validade",
            "U_Cidade",
            "U_Pais",
            "U_Bairro",
            "U_Cep",
            "U_Rua",
            "U_Deposito",
            "U_PPalet",
            "U_PRef",
            "U_PLiq",
            "U_PBru",
            "U_NPalet"
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            $19,
            $20,
            $21,
            $22,
            $23,
            $24
        );
        `
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const validade = line.U_Validade.split('/').reverse().join('-'); // Convertendo para o formato YYYY-MM-DD
            const fabric = line.U_Fabric.split('/').reverse().join('-'); // Convertendo para o formato YYYY-MM-DD
            line.U_Validade = validade;
            line.U_Fabric = fabric;
            const insertLines = await conn.query(insertLinesSql, [
                insertedCabCode,
                line.U_CodItem,
                line.U_Lote,
                line.U_Invoice,
                line.U_CodClient,
                line.U_CardName,
                line.U_DescItem,
                line.U_Unidade,
                line.U_Quant,
                line.U_Preco,
                line.U_Total,
                line.U_Fabric,
                line.U_Validade,
                line.U_Cidade,
                line.U_Pais,
                line.U_Bairro,
                line.U_Cep,
                line.U_Rua,
                line.U_Deposito,
                line.U_PPalet,
                line.U_PRef,
                line.U_PLiq,
                line.U_PBru,
                line.U_NPalet
            ])
        }

        await conn.query('COMMIT');
        saveMapaHana(cab, lines)
        return true
    } catch (error) {
        await conn.query('ROLLBACK');
        console.error('Error starting transaction:', error);
        return false
        throw error;
    } */
}

export async function saveMapaHana(cab: IMapaCab, lines: IMapaLinePayload[], usuario_id: string) {
    const sapSession = await getSapSession()

    const payload: IMapaCarPayload = {
        Code: cab.Code!!,
        U_Veiculo: cab.U_Veiculo,
        U_NPedido: cab.U_NPedido!!,
        U_Placa: cab.U_Placa,
        U_Lacre: cab.U_Lacre,
        U_Motorista: cab.U_Motorista,
        U_DataLog: cab.U_DataLog,
        U_Transport: cab.U_Transport,
        U_Cubagem: cab.U_Cubagem,
        U_OBS: cab.U_OBS,
        U_Data: cab.U_Data,
        MAP_CAR_LINCollection: []
    }

    lines.forEach((item) => {
        payload.MAP_CAR_LINCollection.push({
            Code: item.Code,
            U_CodItem: item.U_CodItem,
            U_Lote: item.U_Lote,
            U_Invoice: item.U_Invoice,
            U_CodClient: item.U_CodClient,
            U_CardName: item.U_CardName,
            U_DescItem: item.U_DescItem,
            U_Unidade: item.U_Unidade,
            U_Quant: item.U_Quant,
            U_Preco: item.U_Preco,
            U_Total: item.U_Total,
            U_Fabric: formatarDataSAP(item.U_Fabric)!!,
            U_Validade: formatarDataSAP(item.U_Validade)!!,
            U_Cidade: item.U_Cidade,
            U_Pais: item.U_Pais,
            U_Bairro: item.U_Bairro,
            U_Cep: item.U_Cep,
            U_Rua: item.U_Rua,
            U_Deposito: item.U_Deposito,
            U_PPalet: item.U_PPalet,
            U_PRef: item.U_PRef,
            U_PLiq: item.U_PLiq,
            U_PBru: item.U_PBru,
            U_NPalet: item.U_NPalet
        })
    })
    await saveMapaLowDB(payload)
    try {
        console.log("========== ENVIO SAP ==========")
        console.log("URL:", `${process.env.SAP_URL}/b1s/v1/MAP_CAR`)
        console.log("Payload:", JSON.stringify(payload, null, 2))

        const response = await fetch(
            `${process.env.SAP_URL}/b1s/v1/MAP_CAR`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `B1SESSION=${sapSession}`
                },
                body: JSON.stringify(payload)
            }
        )

        const responseText = await response.text()

        console.log("========== RESPOSTA SAP ==========")
        console.log("Status:", response.status)
        console.log("Status Text:", response.statusText)
        console.log("Resposta:", responseText)

        if (!response.ok) {
            throw new Error(
                `SAP Service Layer retornou ${response.status}: ${responseText}`
            )
        }

        console.log("Mapa cadastrado no SAP com sucesso!")

        const log: ILog = {
            acao: "Cadastro de Mapa de Carregamento",
            usuario_id: usuario_id,
            entidade: "MAP_CAR",
            entidade_id: cab.Code!!
        };
        await registerLog(log);

        return {
            success: true,
            status: response.status,
            data: responseText
        }

    } catch (err) {
        console.error("========== ERRO AO SALVAR NO SAP ==========")
        console.error(err)

        return {
            success: false
        }

        throw err
    }
}

export async function updateMapaHana(
    cab: IMapaCab,
    lines: IMapaLinePayload[],
    usuario_id: string
) {
    const sapSession = await getSapSession()

    const url = `${process.env.SAP_URL}/b1s/v1/MAP_CAR('${cab.Code}')`

    try {
        console.log("========== UPDATE SAP (PUT - substituição total) ==========")
        console.log("URL:", url)

        const payload: any = {
            U_Veiculo: cab.U_Veiculo,
            U_NPedido: cab.U_NPedido,
            U_Placa: cab.U_Placa,
            U_Lacre: cab.U_Lacre,
            U_Motorista: cab.U_Motorista,
            U_DataLog: cab.U_DataLog,
            U_Transport: cab.U_Transport,
            U_Cubagem: cab.U_Cubagem,
            U_OBS: cab.U_OBS,
            U_Data: cab.U_Data,

            /*
             * Estado final desejado da collection: linhas existentes
             * (com LineId) mantidas/atualizadas, linhas novas (sem
             * LineId) incluídas. O que não estiver aqui deve ser
             * removido pelo PUT (substituição total do recurso).
             */
            MAP_CAR_LINCollection: lines.map(item => {
                const linha: any = {
                    U_CodItem: item.U_CodItem,
                    U_Lote: item.U_Lote,
                    U_Invoice: item.U_Invoice,
                    U_CodClient: item.U_CodClient,
                    U_CardName: item.U_CardName,
                    U_DescItem: item.U_DescItem,
                    U_Unidade: item.U_Unidade,
                    U_Quant: item.U_Quant,
                    U_Preco: item.U_Preco,
                    U_Total: item.U_Total,

                    U_Fabric: formatarDataSAP(item.U_Fabric),
                    U_Validade: formatarDataSAP(item.U_Validade),

                    U_Cidade: item.U_Cidade,
                    U_Pais: item.U_Pais,
                    U_Bairro: item.U_Bairro,
                    U_Cep: item.U_Cep,
                    U_Rua: item.U_Rua,
                    U_Deposito: item.U_Deposito,

                    U_PPalet: item.U_PPalet,
                    U_PRef: item.U_PRef,
                    U_PLiq: item.U_PLiq,
                    U_PBru: item.U_PBru,
                    U_NPalet: item.U_NPalet
                }

                if (item.LineId !== undefined && item.LineId !== null) {
                    linha.LineId = item.LineId
                }

                return linha
            })
        }

        console.log("Total de linhas enviadas (estado final desejado):", lines.length)
        console.log("Payload PUT:")
        console.log(JSON.stringify(payload, null, 2))

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `B1SESSION=${sapSession}`
            },
            body: JSON.stringify(payload)
        })

        const responseText = await response.text()

        console.log("========== RESPOSTA PUT SAP ==========")
        console.log("Status:", response.status)
        console.log("Resposta:", responseText)

        if (!response.ok) {
            throw new Error(
                `SAP Service Layer retornou ${response.status}: ${responseText}`
            )
        }

        console.log("========== MAPA ATUALIZADO COM SUCESSO ==========")
        const log: ILog = {
            acao: "Atualização de Mapa de Carregamento",
            usuario_id: usuario_id,
            entidade: "MAP_CAR",
            entidade_id: cab.Code!!
        };
        await registerLog(log);
        return {
            success: true,
            status: response.status,
            data: responseText
        }

    } catch (err) {

        console.error("========== ERRO AO ATUALIZAR NO SAP ==========")
        console.error(err)

        return {
            success: false,
            error: err instanceof Error
                ? err.message
                : String(err)
        }
    }
}


export async function findMapaByDates(startDate: Date, endDate: Date) {
    const conn = await pgPool.connect();

    const sql = `
        SELECT *
            FROM "MapaDeCarregamento"
        WHERE "dataInicio" >= $1 AND "dataFim" <= $2
    `;

    const result = await conn.query(sql, [startDate, endDate]);
    return result.rows;
}

export async function findMapasDeCarregamentoByDates(dataInicial: string, dataFinal: string): Promise<IMapaCarregamento[]> {
    const conn = await getHanaConnection()
    const sql = `
        -- Consulta de Mapa de Carregamento (Cabeçalho + Linhas) por intervalo de datas

        SELECT 
            T0."Code",             -- Código do mapa de carregamento
            T0."U_NPedido",        -- Número do pedido
            T0."U_Data",           -- Data do carregamento

            T1."U_CodItem",        -- Código do item
            T1."U_Lote",           -- Lote do produto
            T1."U_Invoice",        -- Número da fatura
            T1."U_CodClient",      -- Código do cliente
            T1."U_CardName",       -- Nome do cliente
            T1."U_DescItem",       -- Descrição do item
            T1."U_Unidade",        -- Unidade de medida
            T1."U_Quant",          -- Quantidade
            T1."U_Preco",          -- Preço unitário
            T1."U_Total",          -- Valor total

            T1."U_Fabric",         -- Data de fabricação
            T1."U_Validade",       -- Data de validade

            -- Endereço de destino
            T1."U_Cidade",
            T1."U_Pais",
            T1."U_Bairro",
            T1."U_Cep",
            T1."U_Rua",

            -- Dados logísticos
            T1."U_Deposito",
            T1."U_PPalet",
            T1."U_PRef",
            T1."U_PLiq",
            T1."U_PBru",
            T1."U_NPalet"
        FROM "${HANA_DATABASE}"."@MAP_CAR_CAB" T0
        INNER JOIN "${HANA_DATABASE}"."@MAP_CAR_LIN" T1 ON T0."Code" = T1."Code"  -- Relaciona cabeçalho e linhas
        WHERE 
            T0."U_Data" >= ?  -- Data inicial
            AND T0."U_Data" <= ?  -- Data final
    `


    return new Promise<IMapaCarregamento[]>((resolve, reject) => {
        conn.execute(
            sql,
            [dataInicial, dataFinal],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = (res as IMapaCarregamento[])

                resolve(items);
            }
        );
    });
}

export async function findMapaDeCarregamentoByCode(code: string): Promise<IMapaCab> {
    const conn = await getHanaConnection()
    const sql = `SELECT * FROM "${HANA_DATABASE}"."@MAP_CAR_CAB" WHERE "Code" = ?`

    return new Promise<IMapaCab>((resolve, reject) => {
        conn.execute(
            sql,
            [code],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = (res as IMapaCab[])
                resolve(items[0]);
            }
        );
    });
}

export async function findMapaLinesByCode(code: string): Promise<IMapaLinePayload[]> {
    const conn = await getHanaConnection()
    const sql = `SELECT * FROM "${HANA_DATABASE}"."@MAP_CAR_LIN" WHERE "Code" = ?`
    return new Promise<IMapaLinePayload[]>((resolve, reject) => {
        conn.execute(
            sql,
            [code],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = (res as IMapaLinePayload[])
                resolve(items);
            }
        );
    });
}

function formatarDataSAP(data: any) {
    if (!data) return null

    if (typeof data === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            return data
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
            const [dia, mes, ano] = data.split("/")
            return `${ano}-${mes}-${dia}`
        }
    }

    const date = new Date(data)

    if (isNaN(date.getTime())) {
        return null
    }

    return date.toISOString().split("T")[0]
}