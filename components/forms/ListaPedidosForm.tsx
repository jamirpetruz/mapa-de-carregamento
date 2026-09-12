import { findAllPedidosAction } from "@/actions/pedidoActions/pedidoActions";
import { findAllPedidos } from "@/services/PedidoVenda";
import { IPedidoVendaPick } from "@/types/PedidoPick";
import React, { useEffect, useState } from "react";

interface ListaPedidosVendaProps {
    onSelectPedido?: (numPedido: number) => void
}

export default function ListaPedidosVenda(props: ListaPedidosVendaProps) {

    const [docNumFiltro, setDocNumFiltro] = useState("")
    const [pedidos, setPedidos] = useState<IPedidoVendaPick[]>([])
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            buscarPedidos(docNumFiltro)
        }, 400) // debounce: evita disparar request a cada tecla

        return () => clearTimeout(timeout)
    }, [docNumFiltro])

    async function buscarPedidos(docNum: string) {
        setLoading(true)
        setErro(null)

        try {
            if(docNumFiltro && isNaN(parseInt(docNumFiltro))) {
                return
            }else{
                const resultado = await findAllPedidosAction(docNumFiltro ? parseInt(docNumFiltro) : 0)
                setPedidos(resultado ?? [])
            }
        } catch (err) {
            setErro(err instanceof Error ? err.message : String(err))
            setPedidos([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-4 w-[900px] max-w-full">

            <div className="mb-4">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Filtrar por N° do documento..."
                    value={docNumFiltro}
                    onChange={(e) => setDocNumFiltro(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {erro && (
                <div className="mb-3 text-sm text-red-600">
                    {erro}
                </div>
            )}

            <div className="max-h-[420px] overflow-y-auto border border-gray-200 rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-3 py-2">N° Documento</th>
                            <th className="px-3 py-2">Data Documento</th>
                            <th className="px-3 py-2">Código Cliente</th>
                            <th className="px-3 py-2">Nome Cliente</th>
                            <th className="px-3 py-2">Invoice</th>
                            <th className="px-3 py-2">Total Documento</th>
                            <th className="px-3 py-2">Moeda</th>
                            <th className="px-3 py-2">Filial</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                                    Carregando...
                                </td>
                            </tr>
                        )}

                        {!loading && pedidos.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                                    Nenhum pedido encontrado.
                                </td>
                            </tr>
                        )}

                        {!loading && pedidos.map((pedido, index) => (
                            <tr
                                key={`${pedido.DocNum}-${pedido.CardName}-${index}`}
                                onClick={() => props.onSelectPedido?.(pedido.DocNum)}
                                className="border-t border-gray-100 hover:bg-blue-50 cursor-pointer"
                            >
                                <td className="px-3 py-2">{pedido.DocNum}</td>
                                <td className="px-3 py-2">{pedido.DocDate}</td>
                                <td className="px-3 py-2">{pedido.CardCode}</td>
                                <td className="px-3 py-2">{pedido.CardName}</td>
                                <td className="px-3 py-2">{pedido.NumAtCard}</td>
                                <td className="px-3 py-2">{pedido.DocTotal}</td>
                                <td className="px-3 py-2">{pedido.DocCurrency}</td>
                                <td className="px-3 py-2">{pedido.BPLName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}