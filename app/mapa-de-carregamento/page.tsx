'use client'

import { proximoCodeAction, saveMapa, updateMapaAction } from "@/actions/mapaActions/saveMapa";
import {
  findMapaDeCarregamentoByCodeAction,
  findMapaLinesAction
} from "@/actions/mapaDeCarregamentoActions/mapaDeCarregamentoActions";
import { loadExcel } from "@/actions/xlsxActions/xlsxActions";
import ListaPedidosVenda from "@/components/forms/ListaPedidosForm";
import { NotaSaidaDetalhes } from "@/components/forms/NotaSaidaForm";
import { PedidoDetalhes } from "@/components/forms/PedidoVendaForm";
import { ModalLinha } from "@/components/modal/ModalLinha";
import ModalNotaSaida from "@/components/modal/ModalNotaSaida";
import ModalPedidoVenda from "@/components/modal/ModalPedidoVenda";
import ModalPickPedido from "@/components/modal/ModalPickPedido";
import { SideBar } from "@/components/sideBar/SideBar";
import { MapaLine } from "@/components/tables/MapaLine";
import { SideBarLayout } from "@/components/topbar/TopBar";
import { useItems } from "@/hooks/useItems";
import { IMapaCab } from "@/types/MapaCab";
import { IMapaLine } from "@/types/MapaLine";
import { IMapaLinePayload } from "@/types/MapaLinePayload";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaFileInvoice, FaFileInvoiceDollar, FaPlus, FaRegSave, FaSearch, FaTruck } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuSheet } from "react-icons/lu";

export default function MapaDeCarregamento() {

  const [lines, setLines] = useState<IMapaLinePayload[]>([]);
  const [isModalPedidoVisible, setModalPedidoVisible] = useState<boolean>(false)
  const [isModalNotaVisible, setModalNotaVisible] = useState<boolean>(false)
  const [isModalPickPedidoVisible, setModalPickPedidoVisible] = useState<boolean>(false)
  const [mode, setMode] = useState<'create' | 'update'>('create');
  const { items, loadItems } = useItems();

  const {data: session} = useSession()

  const handlePedidoModal = () => { setModalPedidoVisible(!isModalPedidoVisible) }
  const handleNotaModal = () => { setModalNotaVisible(!isModalNotaVisible) }
  const [mapaCab, setMapaCab] = useState<IMapaCab>({
    Code: null,
    U_NPedido: null,
    U_Lacre: '',
    U_DataLog: '',
    U_Cubagem: '',
    U_Data: '',
    U_Veiculo: '',
    U_Placa: '',
    U_Motorista: '',
    U_Transport: '',
    U_OBS: ''
  });

  const [isModalVisible, setModalVisible] = useState(false);

  const handleModal = () => {
    setModalVisible(prev => !prev);
  };

  const handleModalPickPedido = () => {
    setModalPickPedidoVisible(!isModalPickPedidoVisible);
  };

  const handleChande = (
    field: keyof IMapaCab,
    value: string | number | null
  ) => {
    setMapaCab(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const setNumPedido = (numPedido: number) => {
    handleChande('U_NPedido', numPedido);
    handleModalPickPedido();
    loadItems(numPedido);
  }

  const updateLine = (id: string, newLine: IMapaLine) => {
    const payload: IMapaLinePayload = {
      ...newLine,
      LineId: newLine.LineId ?? undefined,
    };

    setLines(prev =>
      prev.map(line =>
        line.id === id ? payload : line
      )
    );
  };

  const addLine = (line: IMapaLinePayload) => {
    setLines(prev => [...prev, line]);
  };

  const removeLine = (id: string) => {
    setLines(prev =>
      prev.filter(line => line.id !== id)
    );
  };

  const exportSheet = async () => {
    if (lines.length <= 0) {
      alert('Não há linhas no mapa para exportar')
      return
    }
    const dadosExcel = lines.map((line) => ({
      ...line,
      U_Quant: Number(line.U_Quant).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_Preco: Number(line.U_Preco).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_Total: Number(line.U_Total).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PPalet: Number(line.U_PPalet).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PRef: Number(line.U_PRef).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PLiq: Number(line.U_PLiq).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_PBru: Number(line.U_PBru).toLocaleString('pt-br', { maximumFractionDigits: 4, minimumFractionDigits: 2 }),
      U_NPalet: Number(line.U_NPalet),
    }));

    loadExcel(dadosExcel, 'Mapa de Carregamento')
  }

  const handleSave = async () => {
    if (mode === 'create' && !mapaCab.Code) {
      alert('Informe o código do mapa de carregamento')
      return
    }
    if(!mapaCab.U_Data) {
      alert('Informe a data do mapa de carregamento')
      return
    }
    if (!mapaCab.U_NPedido) {
      alert('Informe o número do pedido')
      return
    }
    if (lines.length <= 0) {
      alert('Não há linhas no mapa para salvar')
      return
    }
    if (mode === 'create') {
      const result = await saveMapa(mapaCab, lines, session?.user.id ?? '');
      alert(result?.msg)
      console.log(
        "Salvando mapa de carregamento:",
        mapaCab,
        lines
      );
    } else if (mode === 'update') {
      const result = await updateMapaAction(mapaCab, lines, session?.user.id ?? '');
      alert(result?.msg)
      console.log(
        "Atualizando mapa de carregamento:",
        mapaCab,
        lines
      );
    }

  };

  useEffect(() => {

    const url = new URLSearchParams(location.search);
    const code = url.get('code');

    const loadMapa = async () => {

      if (!code) return;
      setMode('update');
      const mapaCab =
        await findMapaDeCarregamentoByCodeAction(code);
      if (!mapaCab) {
        alert('Mapa de carregamento não encontrado')
        return
      }
      const mapaLines = await findMapaLinesAction(code);
      let mapaLinesWithId = mapaLines.map(line => ({
        ...line,
        U_Fabric: line.U_Fabric ? new Date(line.U_Fabric).toLocaleDateString('pt-BR') : '',
        U_Validade: line.U_Validade ? new Date(line.U_Validade).toLocaleDateString('pt-BR') : '',
        id: crypto.randomUUID()
      }));
      setMapaCab(mapaCab);
      setLines(mapaLinesWithId);
      await loadItems(mapaCab.U_NPedido)
    };

    loadMapa();

  }, []);

  const getProximoCode = async () => {
    if (mode === 'update' && mapaCab.Code) {
      return
    }
    const code = await proximoCodeAction()
    handleChande('Code', code)
  }

  const inputClass =
    "w-full px-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md " +
    "focus:bg-white focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 " +
    "outline-none transition";

  const labelClass =
    "block text-[11px] font-medium text-gray-600 mb-0.5";

  return (
    <SideBarLayout>
      <div className="flex flex-col bg-gray-50/50 overflow-hidden text-gray-800">

        <div className="flex flex-1">

          <main className="flex-1 overflow-y-auto">

            <div className="space-y-3">

              {/* =========================
                CABEÇALHO
            ========================== */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                {/* INFORMAÇÕES GERAIS */}
                <div className="p-3">

                  <div className="flex items-center gap-2 text-slate-600 font-semibold border-b border-gray-100 pb-2 mb-2">
                    <FaFileInvoice className="text-xs" />

                    <h2 className="text-xs tracking-wide uppercase">
                      Informações Gerais
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">

                    <div>
                      <label className={labelClass}>
                        Code
                      </label>

                      <input
                        type="text"
                        value={mapaCab.Code ?? ''}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'Code',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Número do Pedido
                      </label>
                      <div className="flex items-center">

                        <input
                          type="number"
                          value={mapaCab.U_NPedido ?? ''}
                          className={inputClass}
                          onChange={(e) =>
                            handleChande(
                              'U_NPedido',
                              e.target.value
                                ? parseInt(e.target.value)
                                : null
                            )
                          }
                          onBlur={async () => {
                            if (mapaCab.U_NPedido) {
                              await loadItems(mapaCab.U_NPedido);
                              await getProximoCode()
                            }
                          }}
                        />
                        <button title="Informações do Pedido" className='bg-slate-600 px-2 py-1 ml-1 text-white rounded cursor-pointer' onClick={handlePedidoModal}>
                          <IoDocumentTextOutline />
                        </button>
                        <button title="Informações da NF" className='bg-orange-500 px-2 py-1 ml-1 text-white rounded cursor-pointer' onClick={handleNotaModal}>
                          <FaFileInvoiceDollar />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Lacre
                      </label>

                      <input
                        type="text"
                        maxLength={20}
                        value={mapaCab.U_Lacre ?? ''}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_Lacre',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Datalog
                      </label>

                      <input
                        type="text"
                        maxLength={20}
                        value={mapaCab.U_DataLog ?? ''}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_DataLog',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Cubagem
                      </label>

                      <input
                        type="text"
                        value={mapaCab.U_Cubagem ?? ''}
                        className={inputClass}
                        maxLength={10}
                        onChange={(e) =>
                          handleChande(
                            'U_Cubagem',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Data
                      </label>

                      <input
                        type="date"
                        value={
                          mapaCab.U_Data
                            ? new Date(mapaCab.U_Data)
                              .toISOString()
                              .split('T')[0]
                            : ''
                        }
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_Data',
                            e.target.value
                          )
                        }
                      />
                    </div>

                  </div>
                </div>


                {/* DADOS LOGÍSTICOS */}
                <div className="p-3">

                  <div className="flex items-center gap-2 text-slate-600 font-semibold border-b border-gray-100 pb-2 mb-2">

                    <FaTruck className="text-xs" />

                    <h2 className="text-xs tracking-wide uppercase">
                      Dados Logísticos
                    </h2>

                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">

                    <div>
                      <label className={labelClass}>
                        Veículo
                      </label>

                      <input
                        type="text"
                        value={mapaCab.U_Veiculo ?? ''}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_Veiculo',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Placa
                      </label>

                      <input
                        type="text"
                        value={mapaCab.U_Placa ?? ''}
                        maxLength={10}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_Placa',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Motorista
                      </label>

                      <input
                        type="text"
                        value={mapaCab.U_Motorista ?? ''}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_Motorista',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Transportadora
                      </label>

                      <input
                        type="text"
                        value={mapaCab.U_Transport ?? ''}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_Transport',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="col-span-2">

                      <label className={labelClass}>
                        Observação
                      </label>

                      <input
                        type="text"
                        value={mapaCab.U_OBS ?? ''}
                        className={inputClass}
                        onChange={(e) =>
                          handleChande(
                            'U_OBS',
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>
                </div>

              </div>


              {/* =========================
                ITENS
            ========================== */}
              <div className="bg-white border border-gray-200 shadow-sm p-3">

                <div className="flex justify-between items-center mb-2">

                  <h2 className="text-sm font-semibold text-gray-900">
                    Itens do Carregamento
                    <span className="ml-2 text-[10px] text-gray-400 font-normal">
                      {lines.length} itens
                    </span>
                  </h2>

                  <button
                    onClick={handleModal}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-600 hover:bg-blue-700 text-white text-[11px] font-medium rounded-md shadow-sm transition"
                  >
                    <FaPlus size={10} />
                    Adicionar
                  </button>

                </div>


                {/* SCROLL DA TABELA */}
                <div className="max-h-[55vh] overflow-auto border border-gray-200 rounded-md">

                  <table className="w-full text-left border-collapse text-[11px]">

                    <thead className="sticky top-0 z-10">

                      <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase tracking-wide font-medium">

                        <th className="py-2 px-2 whitespace-nowrap">
                          Ação
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Código do Item
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Lote
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Invoice
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Código do Cliente
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Nome do Cliente
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Descrição
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Unidade
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Quantidade
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Preço
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Total
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Fabricação
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Validade
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Cidade
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          País
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Bairro
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          CEP
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Rua
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Depósito
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Peso Pallet
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Peso Ref.
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Peso Líq.
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Peso Bruto
                        </th>

                        <th className="py-2 px-2 whitespace-nowrap">
                          Nº Pallet
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">

                      {lines.map((line) => (

                        <MapaLine
                          key={crypto.randomUUID()}
                          items={items}
                          numPedido={mapaCab.U_NPedido}
                          line={line}
                          onChange={updateLine}
                          removeLine={removeLine}
                        />

                      ))}

                    </tbody>

                  </table>

                </div>
                {/* BOTÃO SALVAR */}
                <div className="flex justify-end mt-2">

                  <button
                    onClick={exportSheet}
                    type="button"
                    className="mr-1 inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md shadow-sm transition"
                  >
                    <LuSheet size={13} />
                    Exportar
                  </button>

                  <button
                    onClick={handleSave}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition"
                  >
                    <FaRegSave size={13} />
                    {mode === 'create' ? 'Salvar' : 'Atualizar'}
                  </button>

                </div>

              </div>

            </div>

          </main>

        </div>

        {isModalVisible && (
          <ModalLinha
            addLine={addLine}
            itemsCode={items}
            numPedido={mapaCab.U_NPedido}
            title="Adicionar Item"
            handleModal={handleModal}
          />
        )}
        {/* MODAL PEDIDO DE VENDA */}
        {isModalPedidoVisible ? <ModalPedidoVenda title="Pedido de Venda" setModalVisible={handlePedidoModal} Node={<PedidoDetalhes numPedido={mapaCab.U_NPedido} />} /> : null}
        {/* MODAL NF SAÍDA */}
        {isModalNotaVisible ? <ModalNotaSaida title="NF Saída" setModalVisible={handleNotaModal} Node={<NotaSaidaDetalhes numPedido={mapaCab.U_NPedido} />} /> : null}

        {isModalPickPedidoVisible ? <ModalPickPedido title="Selecionar Pedido" setModalVisible={setModalPickPedidoVisible} Node={<ListaPedidosVenda onSelectPedido={setNumPedido} />} /> : null}
      </div>
    </SideBarLayout>
  );
}