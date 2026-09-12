'use server'
import { requireAuth } from "@/lib/auth";
import { findClientePedido } from "@/services/Cliente";

export async function loadClientePedido(numPedido: number | null, itemCode: string, numLote: string): Promise<IClientePedido> {
    const session = await requireAuth()
    const clientePedido = await findClientePedido(numPedido, itemCode, numLote);
    return clientePedido;
}