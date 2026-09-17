import { getHanaConnection } from "@/lib/db";
import { getSapSession } from "@/lib/sap/session";
import { IPedidoLine } from "@/types/PedidoLine";
import { IPedidoVendaPick } from "@/types/PedidoPick";
import { IPedidoVenda } from "@/types/PedidoVendaCab";

const HANA_DATABASE = process.env.HANA_DATABASE

export async function findPedidoByNum(docNum: number): Promise<IPedidoVenda> {
    const conn = await getHanaConnection()
    const sql = `
    SELECT 
        T0."DocNum", 
        T0."CardCode", 
        T0."CardName", 
        T0."DocCur", 
        T0."DocDate", 
        T0."DocStatus",
        T0."DocTotalFC",
        T1."BPLName" AS "Filial", 
        T0."TaxDate" FROM "${HANA_DATABASE}".ORDR T0 
    INNER JOIN "${HANA_DATABASE}".OBPL T1 ON T0."BPLId" = T1."BPLId" 
        WHERE T0."DocNum" = ?
    `
    return new Promise<IPedidoVenda>((resolve, reject) => {
        conn.execute(
            sql,
            [docNum],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as IPedidoVenda[];

                resolve(items[0]);
            }
        );
    });
}

export async function findPedidoLines(docNum: number): Promise<IPedidoLine[]> {
    const conn = await getHanaConnection()
    const sql = `
    SELECT 
        T1."ItemCode", 
        T1."Quantity", 
        T1."PriceBefDi" AS "PrecoUnitario", 
        T1."DiscPrcnt", 
        T2."Usage", 
        T1."CFOPCode" FROM "${HANA_DATABASE}".ORDR T0 
    INNER JOIN "${HANA_DATABASE}".RDR1 T1 ON T0."DocEntry" = T1."DocEntry" 
    INNER JOIN "${HANA_DATABASE}".OUSG T2 ON T1."Usage" = T2."ID" 
        WHERE T0."DocNum" = ?
    `
    return new Promise<IPedidoLine[]>((resolve, reject) => {
        conn.execute(
            sql,
            [docNum],
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }

                const items = res as IPedidoLine[];

                resolve(items);
            }
        );
    });
}

export async function findAllPedidos(docNum: number): Promise<IPedidoVendaPick[]> {
    const sapSession = await getSapSession()

    const url = `${process.env.SAP_URL}/b1s/v1/Orders?$select=DocNum,CardCode,CardName,NumAtCard,DocTotal,DocCurrency,BPLName,DocDate&$filter=${docNum}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Cookie': `B1SESSION=${sapSession}`
        }
    })

    const responseText = await response.text()

    if (!response.ok) {
        console.error("========== ERRO AO BUSCAR PEDIDOS ==========")
        console.error("Status:", response.status)
        console.error("Resposta:", responseText)

        throw new Error(
            `SAP Service Layer retornou ${response.status} ao buscar pedidos: ${responseText}`
        )
    }

    const pedidos = JSON.parse(responseText) as { value?: IPedidoVendaPick[] }

    if (!pedidos.value) {
        console.error("Resposta do SAP sem 'value':", pedidos)
        throw new Error("Resposta inesperada do SAP: campo 'value' ausente.")
    }

    console.log(pedidos.value)

    return pedidos.value
}

export async function findPedidoCurrency(numPedido: number): Promise<string> {
    //Orders?$filter=DocNum eq 15
    const sapSession = await getSapSession()

    const url = `${process.env.SAP_URL}/b1s/v1/Orders?$filter=DocNum eq ${numPedido}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Cookie': `B1SESSION=${sapSession}`
        }
    })

    const responseText = await response.text()

    if (!response.ok) {
        console.error("========== ERRO AO BUSCAR PEDIDOS ==========")
        console.error("Status:", response.status)
        console.error("Resposta:", responseText)

        throw new Error(
            `SAP Service Layer retornou ${response.status} ao buscar pedidos: ${responseText}`
        )
    }

    const pedidos = JSON.parse(responseText) as any

    if (!pedidos.value) {
        console.error("Resposta do SAP sem 'value':", pedidos)
        throw new Error("Resposta inesperada do SAP: campo 'value' ausente.")
    }

    return pedidos.value[0].DocCurrency as string
}