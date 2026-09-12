"use client";

import { findItems } from "@/actions/itemActions/itemActions";
import { useState } from "react";

export function useItems() {
    const [items, setItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadItems(numPedido: number | null) {
        try {
            setLoading(true);
            setError(null);

            const result = await findItems(numPedido);

            setItems(result);
        } catch (err) {
            console.error("Erro ao carregar itens:", err);

            setItems([]);
            setError("Erro ao carregar os itens do pedido.");
        } finally {
            setLoading(false);
        }
    }

    return {
        items,
        loading,
        error,
        loadItems,
    };
}