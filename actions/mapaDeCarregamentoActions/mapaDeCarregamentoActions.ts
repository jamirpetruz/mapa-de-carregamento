'use server'

import { requireAuth } from "@/lib/auth"
import { findMapaDeCarregamentoByCode, findMapaLinesByCode, findMapasDeCarregamentoByDates } from "@/services/MapaDeCarregamento"
import { IMapaCab } from "@/types/MapaCab"
import { IMapaCarregamento } from "@/types/MapaDeCarregamento"
import { IMapaLine } from "@/types/MapaLine"
import { IMapaLinePayload } from "@/types/MapaLinePayload"

export async function findMapasDeCarregamentoByDatesAction(dataInicial: string, dataFinal: string): Promise<IMapaCarregamento[]>{
    const session = await requireAuth()
    const mapas = await findMapasDeCarregamentoByDates(dataInicial, dataFinal)
    return mapas
}

export async function findMapaDeCarregamentoByCodeAction(code: string): Promise<IMapaCab>{
    const session = await requireAuth()
    const mapaCab = await findMapaDeCarregamentoByCode(code)
    return mapaCab
}

export async function findMapaLinesAction(code: string): Promise<IMapaLinePayload[]>{
    const session = await requireAuth()
    const mapaLines = await findMapaLinesByCode(code)
    return mapaLines
}