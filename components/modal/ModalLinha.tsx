'use client'
import React, { JSX, ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { LinhaForm } from "../forms/LinhaForm";
import { IoIosCloseCircle } from "react-icons/io";
import { IMapaLine } from "@/types/MapaLine";
import { IMapaLinePayload } from "@/types/MapaLinePayload";

interface ModalLinhaProps {
    itemsCode: string[]
    numPedido: number | null
    handleModal: Function
    title: string
    addLine: (line: IMapaLinePayload) => void
    updateLine?: (id: string, newLine: IMapaLine) => void
}

export function ModalLinha(props: ModalLinhaProps) {
    return (
        <div className="fixed z-100 left-0 top-0 flex items-center justify-center w-screen h-screen bg-black/50">
            <div className="max-w-[1000px] bg-white p-8 rounded-lg shadow-xl">
                <div className="flex items-center justify-between pb-2">
                    <h2 className="text-xl font-bold text-gray-800 text-center">
                        {props.title}
                    </h2>
                    <IoIosCloseCircle className="text-red-500" size={30} onClick={()=> props.handleModal()}/>
                </div>                
                {<LinhaForm 
                    addLine={props.addLine} 
                    itemsCode={props.itemsCode} 
                    numPedido={props.numPedido}
                    handleModal={props.handleModal}
                />}
            </div>
        </div>
    )
}