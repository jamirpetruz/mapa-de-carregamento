'use client'

import { findRomaneioByDatesAction } from "@/actions/romaneioActions/romaneioActions";
import { loadExcel } from "@/actions/xlsxActions/xlsxActions";
import { SideBar } from "@/components/sideBar/SideBar";
import { SideBarLayout } from "@/components/topbar/TopBar";
import { IRomaneio } from "@/types/Romaneio";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuSheet } from "react-icons/lu";

export default function ConsultaRomaneio() {

    const [romaneios, setRomaneios] = useState<IRomaneio[]>([]);

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function buscarRomaneios() {

        if (!dataInicial || !dataFinal) {
            setError("Informe a data inicial e a data final.");
            return;
        }

        if (dataInicial > dataFinal) {
            setError("A data inicial não pode ser maior que a data final.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const result = await findRomaneioByDatesAction(
                dataInicial,
                dataFinal
            );

            setRomaneios(result);

        } catch (error) {

            console.error(error);
            setError("Erro ao buscar os romaneios.");

        } finally {

            setLoading(false);

        }
    }

    const exportSheet = async () => {
        if(romaneios.length <= 0){
            alert('Não há romaneios para exportar')
            return
        }
        const dadosExcel = romaneios.map((line) => ({
            ...line,
            U_Data: new Date(line.U_Data).toLocaleDateString('pt-BR'),
            Total_Geral: Number(line.Total_Geral).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
            Palet_Geral: Number(line.Palet_Geral).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
            Liq_Geral: Number(line.Liq_Geral).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
            Bru_Geral: Number(line.Bru_Geral).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
            Quant_Geral: Number(line.Quant_Geral).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 })
        }));
        loadExcel(dadosExcel, 'Romaneios')
    }

    useEffect(() => {

        const hoje = new Date();

        const data = hoje.toISOString().split("T")[0];

        setDataInicial(data);
        setDataFinal(data);

    }, []);

        const inputClass =
    "w-full px-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md " +
    "focus:bg-white focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 " +
    "outline-none transition";

    return (
        <SideBarLayout>
        <div className="flex flex-col h-screen overflow-hidden text-gray-800">
            <div className="flex flex-col">
                <div className="flex h-screen">

                    <main className="flex-1 flex flex-col min-w-0 overflow-hidden max-h-[90vh]">

                        {/* CONTEÚDO */}
                        <div className="flex-1 flex flex-col overflow-hidden">

                            {/* HEADER */}
                            <div className="flex items-center justify-between px-4 py-2.5">
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-800">
                                        Consulta de Romaneios
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        Consulte os mapas de carregamento por período
                                    </p>
                                </div>
                            </div>

                            {/* FILTROS */}
                            <div className="p-3">
                                <div className="flex items-end gap-3">

                                    {/* DATA INICIAL */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">
                                            Data inicial
                                        </label>
                                        <input
                                            type="date"
                                            value={dataInicial}
                                            onChange={(e) => setDataInicial(e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* DATA FINAL */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">
                                            Data final
                                        </label>
                                        <input
                                            type="date"
                                            value={dataFinal}
                                            onChange={(e) => setDataFinal(e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* BOTÃO */}
                                    <button
                                        type="button"
                                        onClick={buscarRomaneios}
                                        disabled={loading}
                                        className='mr-1 inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition'
                                    >
                                        <FaSearch size={13} />
                                        {loading ? "Buscando..." : "Pesquisar"}
                                    </button>
                                </div>

                                {/* ERRO */}
                                {error && (
                                    <div className="mt-3 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-xs text-red-600">
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* RESULTADOS */}
                            <div className="bg-white rounded-lg border shadow-sm flex flex-col flex-1 min-h-0 m-3">
                                <div className="px-4 py-2.5 border-b flex items-center justify-between shrink-0">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="mr-2">
                                            <h2 className="text-sm font-semibold text-gray-800">
                                                Romaneios
                                            </h2>
                                            <span className="text-xs text-gray-500">
                                                {romaneios.length} registro(s)
                                            </span>
                                        </div>
                                        <button
                                            onClick={exportSheet}
                                            type="button"
                                            className="mr-1 inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md shadow-sm transition"
                                        >
                                            <LuSheet size={13} />
                                            Exportar
                                        </button>
                                    </div>
                                </div>

                                {/* TABELA COM SCROLL VERTICAL */}
                                <div className="overflow-auto flex-1 min-h-0">
                                    <table className="w-full text-xs whitespace-nowrap">
                                        <thead className="bg-gray-100 border-b sticky top-0 z-10">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-semibold">Code</th>
                                                <th className="px-3 py-2 text-left font-semibold">Data</th>
                                                <th className="px-3 py-2 text-left font-semibold">Nº Pedido</th>
                                                <th className="px-3 py-2 text-left font-semibold">Invoice</th>
                                                <th className="px-3 py-2 text-left font-semibold">Cliente</th>
                                                <th className="px-3 py-2 text-right font-semibold">Total Geral</th>
                                                <th className="px-3 py-2 text-left font-semibold">Cidade</th>
                                                <th className="px-3 py-2 text-left font-semibold">País</th>
                                                <th className="px-3 py-2 text-left font-semibold">Bairro</th>
                                                <th className="px-3 py-2 text-left font-semibold">Cep</th>
                                                <th className="px-3 py-2 text-left font-semibold">Rua</th>
                                                <th className="px-3 py-2 text-right font-semibold">Pallet Geral</th>
                                                <th className="px-3 py-2 text-right font-semibold">Líq. Geral</th>
                                                <th className="px-3 py-2 text-right font-semibold">Bru. Geral</th>
                                                <th className="px-3 py-2 text-left font-semibold">Veículo</th>
                                                <th className="px-3 py-2 text-left font-semibold">Placa</th>
                                                <th className="px-3 py-2 text-left font-semibold">Transportadora</th>
                                                <th className="px-3 py-2 text-left font-semibold">Motorista</th>
                                                <th className="px-3 py-2 text-left font-semibold">Lacre</th>
                                                <th className="px-3 py-2 text-left font-semibold">DataLog</th>
                                                <th className="px-3 py-2 text-right font-semibold">Quantidade</th>
                                                <th className="px-3 py-2 text-left font-semibold">Nº Pallet</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">
                                            {loading && (
                                                <tr>
                                                    <td colSpan={13} className="px-3 py-6 text-center text-gray-500">
                                                        Carregando romaneios...
                                                    </td>
                                                </tr>
                                            )}

                                            {!loading && romaneios.length === 0 && (
                                                <tr>
                                                    <td colSpan={13} className="px-3 py-6 text-center text-gray-500">
                                                        Nenhum romaneio encontrado.
                                                    </td>
                                                </tr>
                                            )}

                                            {!loading && romaneios.map((romaneio) => (
                                                <tr key={romaneio.Code} className="hover:bg-gray-50">
                                                    <td className="px-3 py-1.5"><a className="text-blue-500" href={`/mapa-de-carregamento?code=${romaneio.Code}`}>{romaneio.Code}</a></td>
                                                    <td className="px-3 py-1.5 whitespace-nowrap">
                                                        {new Date(romaneio.U_Data).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-3 py-1.5">{romaneio.U_NPedido}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Invoice}</td>
                                                    <td className="px-3 py-1.5 min-w-[200px]">{romaneio.U_CardName}</td>
                                                    <td className="px-3 py-1.5 text-right">{Number(romaneio.Total_Geral).toLocaleString('pt-br', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Cidade}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Pais}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Bairro}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Cep}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Rua}</td>
                                                    <td className="px-3 py-1.5 text-right">{Number(romaneio.Palet_Geral).toLocaleString('pt-br', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}</td>
                                                    <td className="px-3 py-1.5 text-right">{Number(romaneio.Liq_Geral).toLocaleString('pt-br', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}</td>
                                                    <td className="px-3 py-1.5 text-right">{Number(romaneio.Bru_Geral).toLocaleString('pt-br', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Veiculo}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Placa}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Transport}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Motorista}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_Lacre}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_DataLog}</td>
                                                    <td className="px-3 py-1.5 text-right">{Number(romaneio.Quant_Geral).toLocaleString('pt-br', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}</td>
                                                    <td className="px-3 py-1.5">{romaneio.U_NPalet}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        </SideBarLayout>
    );
}