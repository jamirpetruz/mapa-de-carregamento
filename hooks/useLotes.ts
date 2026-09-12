"use client";

import { findLotesByItem } from "@/actions/loteActions/findLote";
import { loadLotes } from "@/services/Lote";
import { useState } from "react";

export function useLotes() {
    const [lotes, setLotes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadLotes(numPedido: number, codItem: string) {
        try {
            setLoading(true);
            setError(null);

            const result = await findLotesByItem(numPedido, codItem);

            setLotes(result);
        } catch (err) {
            console.error("Erro ao carregar lotes:", err);

            setLotes([]);
            setError("Erro ao carregar os lotes dos itens.");
        } finally {
            setLoading(false);
        }
    }

    return {
        lotes,
        loading,
        error,
        loadLotes,
    };
}