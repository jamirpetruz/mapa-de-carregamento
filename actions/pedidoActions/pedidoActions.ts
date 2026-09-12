'use server'

import { requireAuth } from "@/lib/auth";
import { findAllPedidos, findPedidoByNum, findPedidoLines } from "@/services/PedidoVenda";
import { IPedidoLine } from "@/types/PedidoLine";
import { IPedidoVendaPick } from "@/types/PedidoPick";
import { IPedidoVenda } from "@/types/PedidoVendaCab";

export async function findPedidoByDocNumAction(docNum: number): Promise<IPedidoVenda>{
    const session = await requireAuth()
    const result = await findPedidoByNum(docNum)
    return result
}

export async function findPedidoLinesAction(docNum: number): Promise<IPedidoLine[]>{
    const session = await requireAuth()
    const result = await findPedidoLines(docNum)
    return result
}

export async function findAllPedidosAction(docNum: number): Promise<IPedidoVendaPick[]>{
    const session = await requireAuth()
    const result = await findAllPedidos(docNum)
    return result
}