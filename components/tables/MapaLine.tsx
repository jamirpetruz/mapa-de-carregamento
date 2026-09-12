'use client'
import { findLotesByItem } from "@/actions/loteActions/findLote";
import { IMapaLine } from "@/types/MapaLine";
import { IMapaLinePayload } from "@/types/MapaLinePayload";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

interface MapaLineProps {
    line: IMapaLinePayload
    numPedido: number | null
    items: string[]
    onChange: (id: string, newLine: IMapaLine) => void
    removeLine: (id: string) => void
}

export function MapaLine(props: MapaLineProps) {

    const [lotes, setLotes] = useState<string[]>([]);

    const TD_CLASS = "border-b border-r border-gray-200 px-3 py-2 text-xs whitespace-nowrap text-gray-700";
    const INPUT_CLASS = "px-2 py-1.5 text-sm outline-none transition";

    return (
        <tr className="odd:bg-white even:bg-gray-200">
            <td>
                <IoCloseCircle size={22} className="text-red-500" onClick={() => props.removeLine(props.line.id!!)} />
            </td>
            {/*codigo do iem*/}
            <td className={TD_CLASS}>{props.line.U_CodItem}</td>

            {/*lote */}
            <td className={TD_CLASS}>{props.line.U_Lote}</td>
            {/*invoice*/}
            <td className={TD_CLASS}>{props.line.U_Invoice}</td>
            {/*codigo do cliente*/}
            <td className={TD_CLASS}>{props.line.U_CodClient}</td>
            {/*nome do cliente*/}
            <td className={TD_CLASS}>{props.line.U_CardName}</td>
            {/*descricao item*/}
            <td className={TD_CLASS}>{props.line.U_DescItem}</td>
            {/*unidade*/}
            <td className={TD_CLASS}>{props.line.U_Unidade}</td>
            {/*quantidade*/}
            <td className={TD_CLASS}>{Number(props.line.U_Quant).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>
            {/*preco*/}
            <td className={TD_CLASS}>{Number(props.line.U_Preco).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>
            {/*total*/}
            <td className={TD_CLASS}>{Number(props.line.U_Total).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>
            {/*fabricacao*/}
            <td className={TD_CLASS}>{props.line.U_Fabric}</td>
            {/*validade*/}
            <td className={TD_CLASS}>{props.line.U_Validade}</td>
            {/*cidade*/}
            <td className={TD_CLASS}>{props.line.U_Cidade}</td>
            {/*pais*/}
            <td className={TD_CLASS}>{props.line.U_Pais}</td>
            {/*bairro*/}
            <td className={TD_CLASS}>{props.line.U_Bairro}</td>
            {/*cep*/}
            <td className={TD_CLASS}>{props.line.U_Cep}</td>
            {/*rua*/}
            <td className={TD_CLASS}>{props.line.U_Rua}</td>
            {/*deposito*/}
            <td className={TD_CLASS}>{props.line.U_Deposito}</td>
            {/*peso pallet*/}
            <td className={TD_CLASS}>{Number(props.line.U_PPalet).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>
            {/*peso referencia*/}
            <td className={TD_CLASS}>{Number(props.line.U_PRef).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>
            {/*peso liquido*/}
            <td className={TD_CLASS}>{Number(props.line.U_PLiq).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>
            {/*peso bruto*/}
            <td className={TD_CLASS}>{Number(props.line.U_PBru).toLocaleString('pt-br', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}</td>
            {/*nº pallet*/}
            <td className={TD_CLASS}>{props.line.U_NPalet}</td>
        </tr>
    )
}