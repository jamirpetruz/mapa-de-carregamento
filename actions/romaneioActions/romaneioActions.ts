'use server'

import { requireAuth } from "@/lib/auth";
import { findRomaneioByCode, findRomaneiosByDates } from "@/services/Romaneio";
import { IRomaneio } from "@/types/Romaneio";

export async function findRomaneioByDatesAction(dataInicial: string, dataFinal: string): Promise<IRomaneio[]>{
    const session = await requireAuth()
    const romaneios = await findRomaneiosByDates(dataInicial, dataFinal);
    return romaneios
}

export async function findRomaneioByCodeAction(code: string): Promise<IRomaneio>{
    const result = await findRomaneioByCode(code)
    return result
}