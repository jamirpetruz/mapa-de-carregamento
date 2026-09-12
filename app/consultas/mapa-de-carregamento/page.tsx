'use client'

import { findMapasDeCarregamentoByDatesAction } from "@/actions/mapaDeCarregamentoActions/mapaDeCarregamentoActions";
import { loadExcel } from "@/actions/xlsxActions/xlsxActions";
import { SideBar } from "@/components/sideBar/SideBar";
import { SideBarLayout } from "@/components/topbar/TopBar";
import { IMapaCarregamento } from "@/types/MapaDeCarregamento";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuSheet } from "react-icons/lu";

export default function ConsultaMapaDeCarregamento() {

  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const [mapas, setMapas] = useState<IMapaCarregamento[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buscarMapas() {

    if (!dataInicial || !dataFinal) {
      setError("Informe a data inicial e a data final.");
      return;
    }

    if (dataInicial > dataFinal) {
      setError(
        "A data inicial não pode ser maior que a data final."
      );
      return;
    }

    try {

      setLoading(true);
      setError("");

      const result = await findMapasDeCarregamentoByDatesAction(
        dataInicial,
        dataFinal
      );

      setMapas(result);

    } catch (error) {

      console.error(error);

      setError(
        "Erro ao buscar os mapas de carregamento."
      );

    } finally {

      setLoading(false);

    }
  }

  function formatarData(data: string | Date | null | undefined) {

    if (!data) {
      return "";
    }

    if (data instanceof Date) {
      return data.toLocaleDateString("pt-BR");
    }

    const [ano, mes, dia] = data.split("-");

    if (!ano || !mes || !dia) {
      return data;
    }

    return `${dia}/${mes}/${ano}`;
  }

  function formatarNumero(valor: string) {

    if (!valor) {
      return "0";
    }

    return Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const exportSheet = async () => {
    if (mapas.length <= 0) {
      alert('Não há romaneios para exportar')
      return
    }
    const dadosExcel = mapas.map((line) => ({
      ...line,
      U_Data: new Date(line.U_Data).toLocaleDateString('pt-BR'),
      U_Fabric: new Date(line.U_Fabric).toLocaleDateString('pt-BR'),
      U_Validade: new Date(line.U_Validade).toLocaleDateString('pt-BR'),
      U_Quant: Number(line.U_Quant).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_Preco: Number(line.U_Preco).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_Total: Number(line.U_Total).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PPalet: Number(line.U_PPalet).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PRef: Number(line.U_PRef).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PLiq: Number(line.U_PLiq).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PBru: Number(line.U_PBru).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_NPalet: Number(line.U_NPalet),
    }));
    loadExcel(dadosExcel, 'Mapas de Carregamento')
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

            <main className="flex-1 flex flex-col min-w-0 max-h-[90vh]">

              {/* CONTEÚDO */}
              <div className="flex-1 flex flex-col overflow-hidden">

                {/* CABEÇALHO */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-lg">
                  <div>
                    <h1 className="text-lg font-semibold text-gray-800">
                      Consulta de Mapas de Carregamento
                    </h1>
                    <p className="text-xs text-gray-500">
                      Consulte os mapas e seus respectivos itens por período
                    </p>
                  </div>
                </div>

                {/* FILTROS */}
                <div className="p-3">
                  <div className="flex items-end gap-3">

                    {/* DATA INICIAL */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="dataInicial"
                        className="text-xs font-medium text-gray-700"
                      >
                        Data inicial
                      </label>
                      <input
                        id="dataInicial"
                        type="date"
                        value={dataInicial}
                        onChange={(e) => setDataInicial(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    {/* DATA FINAL */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="dataFinal"
                        className="text-xs font-medium text-gray-700"
                      >
                        Data final
                      </label>
                      <input
                        id="dataFinal"
                        type="date"
                        value={dataFinal}
                        onChange={(e) => setDataFinal(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    {/* BOTÃO */}
                    <button
                      type="button"
                      onClick={buscarMapas}
                      disabled={loading}
                      className="mr-1 inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition"
                    >
                      <FaSearch size={13} />
                      {loading ? "Consultando..." : "Pesquisar"}
                    </button>
                  </div>

                  {/* ERRO */}
                  {error && (
                    <div className="mt-3 px-3 py-2 rounded-md border border-red-200 bg-red-50 text-xs text-red-600">
                      {error}
                    </div>
                  )}
                </div>

                {/* RESULTADOS */}
                <div className="bg-white rounded-lg border flex flex-col flex-1 min-h-0 m-3">

                  {/* CABEÇALHO DA TABELA */}
                  <div className="px-4 py-2.5 border-b flex items-center justify-between shrink-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="mr-2">

                        <h2 className="text-sm font-semibold text-gray-800">
                          Mapas de carregamento
                        </h2>
                        <p className="text-xs text-gray-500">
                          {mapas.length} item(ns) encontrado(s)
                        </p>
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

                  {/* SCROLL */}
                  <div className="overflow-auto flex-1 min-h-0">
                    <table className="w-full text-xs whitespace-nowrap">
                      <thead className="sticky top-0 z-10 bg-gray-100 border-b">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">Código</th>
                          <th className="px-3 py-2 text-left font-semibold">Data</th>
                          <th className="px-3 py-2 text-left font-semibold">Pedido</th>
                          <th className="px-3 py-2 text-left font-semibold">Item</th>
                          <th className="px-3 py-2 text-left font-semibold">Lote</th>
                          <th className="px-3 py-2 text-left font-semibold">Invoice</th>
                          <th className="px-3 py-2 text-left font-semibold">Cliente</th>
                          <th className="px-3 py-2 text-left font-semibold">Descrição</th>
                          <th className="px-3 py-2 text-left font-semibold">Unidade</th>
                          <th className="px-3 py-2 text-right font-semibold">Quantidade</th>
                          <th className="px-3 py-2 text-right font-semibold">Preço</th>
                          <th className="px-3 py-2 text-right font-semibold">Total</th>
                          <th className="px-3 py-2 text-left font-semibold">Fabricação</th>
                          <th className="px-3 py-2 text-left font-semibold">Validade</th>
                          <th className="px-3 py-2 text-left font-semibold">Cidade</th>
                          <th className="px-3 py-2 text-left font-semibold">País</th>
                          <th className="px-3 py-2 text-left font-semibold">Bairro</th>
                          <th className="px-3 py-2 text-left font-semibold">CEP</th>
                          <th className="px-3 py-2 text-left font-semibold">Rua</th>
                          <th className="px-3 py-2 text-left font-semibold">Depósito</th>
                          <th className="px-3 py-2 text-right font-semibold">P. Pallet</th>
                          <th className="px-3 py-2 text-right font-semibold">P. Ref.</th>
                          <th className="px-3 py-2 text-right font-semibold">P. Líquido</th>
                          <th className="px-3 py-2 text-right font-semibold">P. Bruto</th>
                          <th className="px-3 py-2 text-right font-semibold">Nº Pallet</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">

                        {/* LOADING */}
                        {loading && (
                          <tr>
                            <td colSpan={25} className="px-3 py-6 text-center text-gray-500">
                              Consultando mapas...
                            </td>
                          </tr>
                        )}

                        {/* VAZIO */}
                        {!loading && mapas.length === 0 && (
                          <tr>
                            <td colSpan={25} className="px-3 py-6 text-center text-gray-500">
                              Nenhum mapa encontrado para o período informado.
                            </td>
                          </tr>
                        )}

                        {/* DADOS */}
                        {!loading && mapas.map((mapa, index) => (
                          <tr key={`${mapa.Code}-${index}`} className="hover:bg-gray-50 transition">
                            <td className="px-3 py-1.5 font-medium"><a className="text-blue-500" href={`/mapa-de-carregamento?code=${mapa.Code}`}>{mapa.Code}</a></td>
                            <td className="px-3 py-1.5">{new Date(mapa.U_Data).toLocaleDateString()}</td>
                            <td className="px-3 py-1.5">{mapa.U_NPedido}</td>
                            <td className="px-3 py-1.5">{mapa.U_CodItem}</td>
                            <td className="px-3 py-1.5">{mapa.U_Lote}</td>
                            <td className="px-3 py-1.5">{mapa.U_Invoice}</td>
                            <td className="px-3 py-1.5 max-w-[200px] truncate">{mapa.U_CardName}</td>
                            <td className="px-3 py-1.5 max-w-[250px] truncate">{mapa.U_DescItem}</td>
                            <td className="px-3 py-1.5">{mapa.U_Unidade}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_Quant)}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_Preco)}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_Total)}</td>
                            <td className="px-3 py-1.5">{new Date(mapa.U_Fabric).toLocaleDateString()}</td>
                            <td className="px-3 py-1.5">{new Date(mapa.U_Validade).toLocaleDateString()}</td>
                            <td className="px-3 py-1.5">{mapa.U_Cidade}</td>
                            <td className="px-3 py-1.5">{mapa.U_Pais}</td>
                            <td className="px-3 py-1.5">{mapa.U_Bairro}</td>
                            <td className="px-3 py-1.5">{mapa.U_Cep}</td>
                            <td className="px-3 py-1.5">{mapa.U_Rua}</td>
                            <td className="px-3 py-1.5">{mapa.U_Deposito}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_PPalet)}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_PRef)}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_PLiq)}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_PBru)}</td>
                            <td className="px-3 py-1.5 text-right">{formatarNumero(mapa.U_NPalet)}</td>
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