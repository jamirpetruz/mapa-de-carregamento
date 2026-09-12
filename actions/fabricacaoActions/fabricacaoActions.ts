'use server'

import { requireAuth } from "@/lib/auth";
import { findFabricacao } from "@/services/Fabricacao";
import { IFabricacao } from "@/types/Fabricacao";

export async function loadFabricacao(numPedido: number | null, itemCode: string, numLote: string): Promise<IFabricacao> {
    const session = await requireAuth()
    const fabricacao = await findFabricacao(numPedido, itemCode, numLote);
    return fabricacao;
}
    