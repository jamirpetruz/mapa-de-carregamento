'use server'

import { requireAuth } from "@/lib/auth";
import { findDeposito, findPesoReferencia, findPesos } from "@/services/Carregamento";
import { getServerSession } from "next-auth";

export async function loadPesoRef(itemCode: string): Promise<number> {
    const session = await requireAuth()

    const pesoRef = await findPesoReferencia(itemCode);
    return pesoRef;
}

export async function loadPesos(
    pesoPalet: number, 
    pesoReferencia: number,
    numPedido: number | null, 
    itemCode: string, 
    numLote: string
): Promise<{ pesoLiquido: number, pesoBruto: number }> {
    const session = await requireAuth()
    const pesos = await findPesos(pesoPalet, pesoReferencia, numPedido, itemCode, numLote);
    return pesos;
}

export async function loadDeposito(numPedido: number | null){
    const session = await requireAuth()
    const deposito = await findDeposito(numPedido);
    return deposito;
}
