'use server'
import { requireAuth } from "@/lib/auth";
import { findBairro, findCep, findCidade, findEndereco, findPais, findRua } from "@/services/Endereco";
import { IEndereco } from "@/types/Endereco";

export async function loadEndereco(numPedido: number | null): Promise<IEndereco> {
    const session = await requireAuth()
    const endereco = await findEndereco(numPedido);
    return endereco;
}