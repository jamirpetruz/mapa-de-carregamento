'use client'

import { findLogsBetweenDatesAction } from "@/actions/logActions/logActions";
import { findRomaneioByDatesAction } from "@/actions/romaneioActions/romaneioActions";
import { loadExcel } from "@/actions/xlsxActions/xlsxActions";
import { SideBar } from "@/components/sideBar/SideBar";
import { SideBarLayout } from "@/components/topbar/TopBar";
import { ILog } from "@/types/Log";
import { IRomaneio } from "@/types/Romaneio";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuSheet } from "react-icons/lu";

export default function ConsultaRomaneio() {

    const [logs, setLogs] = useState<ILog[]>([])
    const [dataInicial, setDataInicial] = useState("")
    const [dataFinal, setDataFinal] = useState("")

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function buscarLogs() {

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

            const result = await findLogsBetweenDatesAction(
                dataInicial,
                dataFinal
            );

            setLogs(result);

        } catch (error) {

            console.error(error);
            setError("Erro ao buscar os logs.");

        } finally {

            setLoading(false);

        }
    }

    const exportSheet = async () => {
        loadExcel(logs, 'Logs')
    }

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
                                            Consulta de Logs
                                        </h1>
                                        <p className="text-xs text-gray-500">
                                            Consulte os logs por período
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
                                            onClick={buscarLogs}
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
                                                    Logs
                                                </h2>
                                                <span className="text-xs text-gray-500">
                                                    {logs.length} registro(s)
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
                                                    <th className="px-3 py-2 text-left font-semibold">Entidade</th>
                                                    <th className="px-3 py-2 text-left font-semibold">Ação</th>
                                                    <th className="px-3 py-2 text-left font-semibold">Usuário</th>
                                                    <th className="px-3 py-2 text-left font-semibold">Tabela</th>
                                                    <th className="px-3 py-2 text-left font-semibold">Data</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y">
                                                {loading && (
                                                    <tr>
                                                        <td colSpan={13} className="px-3 py-6 text-center text-gray-500">
                                                            Carregando logs...
                                                        </td>
                                                    </tr>
                                                )}

                                                {!loading && logs.length === 0 && (
                                                    <tr>
                                                        <td colSpan={13} className="px-3 py-6 text-center text-gray-500">
                                                            Nenhum log encontrado.
                                                        </td>
                                                    </tr>
                                                )}

                                                {!loading && logs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-gray-50">
                                                        <td className="px-3 py-1.5"><a className="text-blue-500" href={`/mapa-de-carregamento?code=${log.entidade_id}`}>{log.entidade_id}</a></td>
                                                        <td className="px-3 py-1.5">{log.acao}</td>
                                                        <td className="px-3 py-1.5">{log.usuario_id}</td>
                                                        <td className="px-3 py-1.5">{log.entidade}</td>
                                                        <td className="px-3 py-1.5 whitespace-nowrap">
                                                            {new Date(log.data_hora!!).toLocaleDateString()}
                                                        </td>
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