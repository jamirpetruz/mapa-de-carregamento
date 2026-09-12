import { title } from "process";
import React, { JSX, ReactNode } from "react";
import { IoIosClose } from "react-icons/io";
import ListaPedidosVenda from "../forms/ListaPedidosForm";

interface ModalProps {
    Node: JSX.Element
    setModalVisible: Function
    title: string
}

export default function ModalPickPedido(props: ModalProps) {
    return (
        <div className="fixed z-100 left-0 top-0 flex items-center justify-center w-screen h-screen bg-black/50">
            <div className="max-w-[800px] bg-white p-8 rounded-lg shadow-xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 text-center">
                        {props.title}
                    </h2>
                        <IoIosClose onClick={()=> props.setModalVisible()} className="bg-red-400 rounded-[50%] text-white h-[35px] w-[35px] cursor-pointer"/>
                </div>
                {props.Node}
            </div>
        </div>
    )
}