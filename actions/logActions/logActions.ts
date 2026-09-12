'use server'

import { findLogsBetweenDates } from "@/services/Log";

export async function findLogsBetweenDatesAction(dataInicial: string, dataFinal: string){
    const result = await findLogsBetweenDates(dataInicial, dataFinal)
    return result
}