'use server'

import { requireAuth } from "@/lib/auth"
import { loadLotes } from "@/services/Lote"

export async function findLotesByItem(numPedido: number | null, codItem: string) {
        const session = await requireAuth()
        const lotes = await loadLotes(numPedido, codItem)
        return lotes
}