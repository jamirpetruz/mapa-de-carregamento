'use server'

import { requireAuth } from "@/lib/auth";
import { findItemDesc, findItemsByPedido, findItemUnidade, findPreco, findQuantidade, findTotal } from "@/services/Item";

export async function findItems(numPedido: number | null): Promise<string[]>{
    const session = await requireAuth()
    const items = await findItemsByPedido(numPedido)
    return items
}

export async function findDescByItem(itemCode: string): Promise<string>{
    const session = await requireAuth()
    const itemDesc = await findItemDesc(itemCode)
    return itemDesc
}

export async function findUnidadeByItem(itemCode: string){
    const session = await requireAuth()
    const unidade = findItemUnidade(itemCode)
    return unidade
}

export async function findQuantidadeByItem(numPedido: number | null, itemCode: string, numLote: string){
    const session = await requireAuth()
    const quantidade = await findQuantidade(numPedido, itemCode, numLote)
    return quantidade
}

export async function findPrecoByPendidoAndItem(numPedido: number | null, itemCode: string){
    const session = await requireAuth()
    const preco = await findPreco(numPedido, itemCode)
    return preco
}

export async function findTotalByPedidoItem(numPedido: number | null, itemCode: string, numLote: string){
    const session = await requireAuth()
    const total = await findTotal(numPedido, itemCode, numLote)
    return total
}