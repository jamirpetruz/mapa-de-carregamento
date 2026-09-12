"use client";

import { findPedidoByDocNumAction, findPedidoLinesAction } from "@/actions/pedidoActions/pedidoActions";
import { IPedidoLine } from "@/types/PedidoLine";
import { IPedidoVenda } from "@/types/PedidoVendaCab";
import { useEffect, useState } from "react";

interface PedidoDetalhesProps {
    numPedido: number | null;
}

export function PedidoDetalhes({
    numPedido,
}: PedidoDetalhesProps) {

    const [pedido, setPedido] = useState<IPedidoVenda | null>(null);
    const [lines, setLines] = useState<IPedidoLine[]>([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {


        const loadLines = async () => {
            if (!numPedido) {
                setPedido(null);
                return;
            }
            try {
                const result = await findPedidoLinesAction(numPedido)
                console.log(`Linhas ${result}`)
                setLines(result)
            } catch (error) {
                console.log(error)
            }
        }

        const loadPedido = async () => {

            if (!numPedido) {
                setPedido(null);
                return;
            }

            try {
                setLoading(true);

                const result = await findPedidoByDocNumAction(numPedido);

                setPedido(result ?? null);
                loadLines()
            } catch (error) {
                console.error(
                    "Erro ao carregar pedido:",
                    error
                );

                setPedido(null);

            } finally {
                setLoading(false);
            }
        };

        loadPedido();

    }, [numPedido]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <span className="text-sm text-gray-500">
                    Carregando pedido...
                </span>
            </div>
        );
    }

    if (!numPedido) {
        return (
            <div className="flex items-center justify-center py-10">
                <span className="text-sm text-gray-400">
                    Nenhum pedido selecionado.
                </span>
            </div>
        );
    }

    if (!pedido) {
        return (
            <div className="flex items-center justify-center py-10">
                <span className="text-sm text-red-500">
                    Pedido não encontrado.
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full mt-2 max-h-[80vh]">

            {/* ============================= */}
            {/* CABEÇALHO */}
            {/* ============================= */}

            <div className="border border-gray-200 rounded-lg bg-white shadow-sm">

                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-xs text-gray-400">
                                Documento #{pedido.DocNum}
                            </p>
                        </div>

                        <span className={`x-3 py-1 rounded-full text-xs font-medium px-2 ${pedido.DocStatus == 'C' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {pedido.DocStatus == 'C' ? 'Fechado' : 'Aberto'}
                        </span>

                    </div>

                </div>

                {/* ============================= */}
                {/* INFORMAÇÕES */}
                {/* ============================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 px-4 py-3">

                    <div className="space-y-2">

                        <Info
                            label="Nº Documento"
                            value={pedido.DocNum}
                        />

                        <Info
                            label="Código Cliente"
                            value={pedido.CardCode}
                        />
                        <Info
                            label="Nome"
                            value={pedido.CardName}
                        />

                        <Info
                            label="Moeda"
                            value={pedido.DocCur}
                        />

                    </div>

                    <div className="space-y-2">

                        <Info
                            label="Data Lançamento"
                            value={formatDate(pedido.DocDate)}
                        />

                        <Info
                            label="Data Documento"
                            value={formatDate(pedido.TaxDate)}
                        />

                        <Info
                            label="Filial"
                            value={pedido.Filial}
                        />

                        
                        <Info
                            label="Total Documento"
                            value={`${pedido.DocCur} ${Number(pedido.DocTotalFC).toFixed(2)}`}
                        />

                    </div>

                </div>

            </div>

            {/* ============================= */}
            {/* ITENS */}
            {/* ============================= */}

            <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-auto">

                <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">

                    <h3 className="text-sm font-semibold text-gray-700">
                        Itens do Pedido
                    </h3>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-xs">

                        <thead>

                            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">

                                <th className="px-3 py-2 text-left font-medium">
                                    Nº Item
                                </th>

                                <th className="px-3 py-2 text-right font-medium">
                                    Quantidade
                                </th>

                                <th className="px-3 py-2 text-right font-medium">
                                    Preço Unitário
                                </th>

                                <th className="px-3 py-2 text-right font-medium">
                                    % Desconto
                                </th>

                                <th className="px-3 py-2 text-left font-medium">
                                    Utilização
                                </th>

                                <th className="px-3 py-2 text-left font-medium">
                                    CFOP
                                </th>

                            </tr>

                        </thead>

                        <tbody>
                            {lines.length > 0 ? (
                                lines.map((line, index) => (
                                    <tr
                                        key={`${line.ItemCode}-${index}`}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-3 py-2 text-left font-medium text-gray-700">
                                            {line.ItemCode}
                                        </td>

                                        <td className="px-3 py-2 text-right text-gray-600">
                                            {Number(line.Quantity)}
                                        </td>

                                        <td className="px-3 py-2 text-right text-gray-600">
                                            {line.PrecoUnitario}
                                        </td>

                                        <td className="px-3 py-2 text-right text-gray-600">
                                            {line.DiscPrcnt}%
                                        </td>

                                        <td className="px-3 py-2 text-left text-gray-600">
                                            {line.Usage}
                                        </td>

                                        <td className="px-3 py-2 text-left text-gray-600">
                                            {line.CFOPCode}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-3 py-8 text-center text-gray-400"
                                    >
                                        Nenhum item encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}


/* ================================= */
/* COMPONENTE DE INFORMAÇÃO          */
/* ================================= */

interface InfoProps {
    label: string;
    value?: string | number | null;
}

function Info({
    label,
    value,
}: InfoProps) {

    return (
        <div className="flex items-center text-sm">

            <span className="w-36 shrink-0 text-gray-400">
                {label}:
            </span>

            <span className="font-medium text-gray-700 truncate">
                {value ?? "-"}
            </span>

        </div>
    );
}


/* ================================= */
/* DATA                               */
/* ================================= */

function formatDate(
    value?: string | Date | null
) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("pt-BR");
}