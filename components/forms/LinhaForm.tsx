'use client'
import { loadDeposito, loadPesoRef, loadPesos } from "@/actions/carregamentoActions/carregamentoActions";
import { loadClientePedido } from "@/actions/clienteActions/clienteActions";
import { loadEndereco } from "@/actions/enderecoActions/enderecoActions";
import { loadFabricacao } from "@/actions/fabricacaoActions/fabricacaoActions";
import { findDescByItem, findPrecoByPendidoAndItem, findQuantidadeByItem, findTotalByPedidoItem, findUnidadeByItem } from "@/actions/itemActions/itemActions";
import { findLotesByItem } from "@/actions/loteActions/findLote";
import { IMapaLine } from "@/types/MapaLine";
import { IMapaLinePayload } from "@/types/MapaLinePayload";
import { useEffect, useState } from "react";

interface LinhaFormProps {
    itemsCode: string[]
    numPedido: number | null
    addLine: (line: IMapaLinePayload) => void
    handleModal: Function
}
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
export function LinhaForm(props: LinhaFormProps) {
    const [lotes, setLotes] = useState<string[]>([])
    const [line, setLine] = useState<IMapaLinePayload>({
        id: generateId(),
        Code: '',
        U_CodItem: "",
        U_Lote: "",
        U_Invoice: "",
        U_CodClient: "",
        U_CardName: "",
        U_DescItem: "",
        U_Unidade: "",
        U_Quant: 0,
        U_Preco: 0,
        U_Total: 0,
        U_Fabric: "",
        U_Validade: "",
        U_Cidade: "",
        U_Pais: "",
        U_Bairro: "",
        U_Cep: "",
        U_Rua: "",
        U_Deposito: "",
        U_PPalet: 0,
        U_PRef: 0,
        U_PLiq: 0,
        U_PBru: 0,
        U_NPalet: 0
    })

    useEffect(() => {
        const getEndereco = async () => {
            const endereco = await loadEndereco(props.numPedido)
            handleChange('U_Pais', endereco.pais)
            handleChange('U_Cidade', endereco.cidade)
            handleChange('U_Bairro', endereco.bairro)
            handleChange('U_Rua', endereco.rua)
            handleChange('U_Cep', endereco.cep)
        }
        const getDeposito = async () => {
            const deposito = await loadDeposito(props.numPedido)
            handleChange('U_Deposito', deposito)
        }

        getEndereco()
        getDeposito()
    }, [])

    const handleChange = <K extends keyof IMapaLine>(
        field: K,
        value: IMapaLine[K]
    ) => {
        setLine((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const loadLotes = async (U_CodItem: string) => {
        const lotes = await findLotesByItem(props.numPedido, U_CodItem)
        setLotes(lotes)
    }
    const loadItemDesc = async (U_CodItem: string) => {
        const itemDesc = await findDescByItem(U_CodItem)
        handleChange('U_DescItem', itemDesc)
    }
    const loadItemUnidade = async (U_CodItem: string) => {
        const itemUnidade = await findUnidadeByItem(U_CodItem)
        handleChange('U_Unidade', itemUnidade)
    }
    const loadItemQuantidade = async (U_Lote: string) => {
        const itemQuantidade = await findQuantidadeByItem(props.numPedido, line.U_CodItem, U_Lote)
        handleChange('U_Quant', Number(itemQuantidade))
    }
    const loadItemPreco = async (U_CodItem: string) => {
        const itemPreco = await findPrecoByPendidoAndItem(props.numPedido, U_CodItem)
        handleChange('U_Preco', Number(itemPreco))
    }
    const loadItemTotal = async (U_Lote: string) => {
        const total = await findTotalByPedidoItem(props.numPedido, line.U_CodItem, U_Lote)
        handleChange('U_Total', Number(total))
    }

    const getClientePedido = async (U_Lote: string) => {
        const clientePedido = await loadClientePedido(props.numPedido, line.U_CodItem, U_Lote)
        handleChange('U_CodClient', clientePedido.codCliente)
        handleChange('U_CardName', clientePedido.nomeCliente)
        handleChange('U_Invoice', clientePedido.invoice || "")
    }
    const getFabricacao = async (U_Lote: string) => {
        const fabricacao = await loadFabricacao(props.numPedido, line.U_CodItem, U_Lote)
        handleChange('U_Fabric', new Date(fabricacao.fabricacao).toLocaleDateString())
        handleChange('U_Validade', new Date(fabricacao.validade).toLocaleDateString())
    }

    const getPesos = async (
        pesoPalet: number,
        pesoRef: number,
        itemCode: string,
        lote: string
    ) => {

        if (!itemCode || !lote) {
            console.log("Item ou lote não informado")
            return
        }

        const pesos = await loadPesos(
            pesoPalet,
            pesoRef,
            props.numPedido,
            itemCode,
            lote
        )

        console.log(
            `${itemCode} - ${lote} - ${pesoPalet} - ${pesoRef} - ${pesos.pesoLiquido} - ${pesos.pesoBruto}`
        )

        handleChange('U_PLiq', Number(pesos.pesoLiquido ?? 0))
        handleChange('U_PBru', Number(pesos.pesoBruto ?? 0))
    }

    const getPesoRef = async (U_CodItem: string) => {
        const pesoRef = await loadPesoRef(U_CodItem)

        console.log("COD ITEM:", U_CodItem)
        console.log("PESO REFERÊNCIA:", pesoRef)
        console.log("PESO PALETE:", line.U_PPalet)

        handleChange('U_PRef', pesoRef)
    }
    return (
        <div className="max-h-[75vh] overflow-y-auto pr-2">
            <div className="space-y-3">

                {/* Produto */}
                <section className="rounded-md border bg-white p-3">
                    <h2 className="mb-2 text-sm font-semibold">
                        Produto
                    </h2>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="text-xs font-medium">
                                Código do Item
                            </label>
                            <select
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                name=""
                                id=""
                                value={line.U_CodItem}
                                onChange={async (e) => {
                                    const U_CodItem = e.target.value
                                    handleChange('U_CodItem', U_CodItem)
                                    await Promise.all([
                                        await loadLotes(U_CodItem),
                                        await loadItemDesc(U_CodItem),
                                        await loadItemUnidade(U_CodItem),
                                        await loadItemPreco(U_CodItem),
                                        await getPesoRef(U_CodItem)
                                    ])
                                }}
                            >
                                <option value="">Selecione um item</option>
                                {props.itemsCode.map((item) => {
                                    return (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Lote
                            </label>
                            <select
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                name=""
                                id=""
                                onChange={async (e) => {
                                    const U_Lote = e.target.value
                                    handleChange('U_Lote', U_Lote)
                                    await Promise.all([
                                        await loadItemQuantidade(U_Lote),
                                        await loadItemTotal(U_Lote),
                                        await getClientePedido(U_Lote),
                                        await getFabricacao(U_Lote)
                                    ])
                                }}
                            >
                                <option value="">Selecione um lote</option>
                                {lotes.map((lote, index) => {
                                    return (
                                        <option key={index} value={lote}>
                                            {lote}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Descrição
                            </label>
                            <input
                                type="text"
                                name="U_DescItem"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_DescItem}
                                onChange={(e) => {
                                    handleChange('U_DescItem', e.target.value)
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Unidade
                            </label>
                            <input
                                type="text"
                                name="U_Unidade"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Unidade}
                                onChange={(e) => {
                                    handleChange('U_Unidade', e.target.value)
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Quantidade
                            </label>
                            <input
                                type="number"
                                name="U_Quant"
                                step="any"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Quant}
                                onChange={(e) => {
                                    handleChange('U_Quant', Number(e.target.value))
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Preço
                            </label>
                            <input
                                type="number"
                                name="U_Preco"
                                step="any"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Preco}
                                onChange={(e) => {
                                    handleChange('U_Preco', Number(e.target.value))
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Total
                            </label>
                            <input
                                type="number"
                                name="U_Total"
                                step="any"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Total}
                                onChange={(e) => {
                                    handleChange('U_Total', Number(e.target.value))
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Cliente */}
                <section className="rounded-md border bg-white p-3">
                    <h2 className="mb-2 text-sm font-semibold">
                        Cliente
                    </h2>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium">
                                Código do Cliente
                            </label>
                            <input
                                type="text"
                                name="U_CodClient"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_CodClient}
                                onChange={(e) => {
                                    handleChange('U_CodClient', e.target.value)
                                }}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="text-xs font-medium">
                                Nome do Cliente
                            </label>
                            <input
                                type="text"
                                name="U_CardName"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_CardName}
                                onChange={(e) => {
                                    handleChange('U_CardName', e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Fabricação */}
                <section className="rounded-md border bg-white p-3">
                    <h2 className="mb-2 text-sm font-semibold">
                        Fabricação e Validade
                    </h2>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-medium">
                                Fabricante
                            </label>
                            <input
                                type="text"
                                name="U_Fabric"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Fabric}
                                onChange={(e) => {
                                    handleChange('U_Fabric', e.target.value)
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Validade
                            </label>
                            <input
                                type="text"
                                name="U_Validade"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Validade}
                                onChange={(e) => {
                                    handleChange('U_Validade', e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Endereço */}
                <section className="rounded-md border bg-white p-3">
                    <h2 className="mb-2 text-sm font-semibold">
                        Endereço de Entrega
                    </h2>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="text-xs font-medium">
                                País
                            </label>
                            <input
                                type="text"
                                name="U_Pais"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Pais}
                                onChange={(e) => {
                                    handleChange('U_Pais', e.target.value)
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Cidade
                            </label>
                            <input
                                type="text"
                                name="U_Cidade"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Cidade}
                                onChange={(e) => {
                                    handleChange('U_Cidade', e.target.value)
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Bairro
                            </label>
                            <input
                                type="text"
                                name="U_Bairro"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Bairro}
                                onChange={(e) => {
                                    handleChange('U_Bairro', e.target.value)
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                CEP
                            </label>
                            <input
                                type="text"
                                name="U_Cep"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Cep}
                                onChange={(e) => {
                                    handleChange('U_Cep', e.target.value)
                                }}
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-4">
                            <label className="text-xs font-medium">
                                Rua
                            </label>
                            <input
                                type="text"
                                name="U_Rua"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Rua}
                                onChange={(e) => {
                                    handleChange('U_Rua', e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Carregamento */}
                <section className="rounded-md border bg-white p-3">
                    <h2 className="mb-2 text-sm font-semibold">
                        Carregamento
                    </h2>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="text-xs font-medium">
                                Invoice
                            </label>
                            <input
                                type="text"
                                name="U_Invoice"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Invoice}
                                onChange={(e) => {
                                    handleChange('U_Invoice', e.target.value)
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium">
                                Depósito
                            </label>
                            <input
                                type="text"
                                name="U_Deposito"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_Deposito}
                                onChange={(e) => {
                                    handleChange('U_Deposito', e.target.value)
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Peso Palete
                            </label>
                            <input
                                type="number"
                                name="U_PPalet"
                                step="0.1"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                onChange={(e) => {
                                    handleChange('U_PPalet', Number(e.target.value))
                                }}
                                onBlur={async (e) => {
                                    const pesoPalet = Number(e.currentTarget.value || 0)

                                    await getPesos(
                                        pesoPalet,
                                        line.U_PRef,
                                        line.U_CodItem,
                                        line.U_Lote
                                    )
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Peso Referência
                            </label>
                            <input
                                type="number"
                                name="U_PRef"
                                step="any"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_PRef}
                                onChange={(e) => {
                                    handleChange('U_PRef', Number(e.target.value))
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Peso Líquido
                            </label>
                            <input
                                type="number"
                                name="U_PLiq"
                                step="any"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_PLiq ?? 0}
                                onChange={(e) => {
                                    handleChange('U_PLiq', Number(e.target.value))
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Peso Bruto
                            </label>
                            <input
                                type="number"
                                name="U_PBru"
                                step="any"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                value={line.U_PBru ?? 0}
                                onChange={(e) => {
                                    handleChange('U_PBru', Number(e.target.value))
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">
                                Nº Pallet
                            </label>
                            <input
                                type="number"
                                name="U_NPalet"
                                step="any"
                                className="mt-0.5 h-7 w-full rounded border px-2 text-xs"
                                onChange={(e) => {
                                    handleChange('U_NPalet', Number(e.target.value))
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Botões */}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="h-8 rounded border px-3 text-xs"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="h-8 rounded bg-blue-600 px-3 text-xs text-white hover:bg-blue-700"
                        onClick={() => {
                            props.addLine(line)
                            props.handleModal()
                        }}
                    >
                        Adicionar Item
                    </button>
                </div>
            </div>
        </div>
    )
}