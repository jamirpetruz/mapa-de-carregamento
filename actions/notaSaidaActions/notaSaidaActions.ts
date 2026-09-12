'use server'

import { requireAuth } from "@/lib/auth"
import { findNotaSaida, findNotaSaidaLines } from "@/services/NotaSaida"
import { INotaSaida } from "@/types/NotaSaida"
import { INotaSaidaLine } from "@/types/NotaSaidaLine"

export async function findNotaSaidaAction(numPedido: number): Promise<INotaSaida>{
    const session = await requireAuth()
    const result = await findNotaSaida(numPedido)
    return result
}

export async function findNotaSaidaLinesAction(numPedido: number): Promise<INotaSaidaLine[]>{
    const session = await requireAuth()
    const result = await findNotaSaidaLines(numPedido)
    return result
}