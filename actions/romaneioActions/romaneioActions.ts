'use server'

import { requireAuth } from "@/lib/auth";
import { findRomaneiosByDates } from "@/services/Romaneio";
import { IRomaneio } from "@/types/Romaneio";

export async function findRomaneioByDatesAction(dataInicial: string, dataFinal: string): Promise<IRomaneio[]>{
    const session = await requireAuth()
    const romaneios = await findRomaneiosByDates(dataInicial, dataFinal);
    return romaneios
}