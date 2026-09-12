'use client'

import { findAllUsuariosAction } from "@/actions/usuarioActions/usuarioActions";
import UsuarioForm from "@/components/forms/UsuarioForm";
import Modal from "@/components/modal/Modal";
import {SideBar} from "@/components/sideBar/SideBar";
import {SideBarLayout} from "@/components/topbar/TopBar";
import { IUsuario } from "@/types/Usuario";
import { useEffect, useState } from "react";
import { IoAddOutline, IoCreateOutline, IoPersonOutline, IoSearchOutline, IoTrashOutline } from "react-icons/io5";
function getRoleLabel(role: string) {
    switch (role) {
        case "admin":
            return "Administrador"

        case "motorista":
            return "Motorista"

        case "user":
            return "Usuário"

        default:
            return role
    }
}

function getRoleClass(role: string) {
    switch (role) {
        case "admin":
            return "bg-purple-100 text-purple-700"

        case "motorista":
            return "bg-orange-100 text-orange-700"

        default:
            return "bg-blue-100 text-blue-700"
    }
}
export default function Usuarios() {
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMode, setModalMode] = useState<'create' | 'update'>('create')
    const [selectedUsuario, setSelectedUsuario] = useState<IUsuario | null>(null)
    const handleModal = () => {
        setModalVisible(!modalVisible)
    }
    const [usuarios, setUsuarios] = useState<IUsuario[]>([])

    useEffect(() => {
        const loadUsuarios = async () => {
            const result = await findAllUsuariosAction();
            setUsuarios(result)
        }
        loadUsuarios()
    }, [])


    return (
        <SideBarLayout>
        <div className="flex flex-col h-screen bg-gray-50/50 overflow-hidden text-gray-800">
            <div className="flex justify-left flex-col">
                <div className='flex h-screen'>

                    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-6">

                            {/* Cabeçalho */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800">
                                        Usuários
                                    </h1>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Gerencie os usuários e suas permissões.
                                    </p>
                                </div>

                                <button
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition"
                                    onClick={() => {
                                        setModalMode('create')
                                        handleModal()
                                    }}
                                >
                                    <IoAddOutline size={20} />

                                    Novo usuário
                                </button>

                            </div>


                            {/* Tabela */}
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="bg-gray-50 border-b border-gray-200">

                                            <tr>

                                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                                    Usuário
                                                </th>

                                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                                    E-mail
                                                </th>

                                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                                    Função
                                                </th>

                                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                                    Status
                                                </th>

                                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                                    Ações
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody className="divide-y divide-gray-100">

                                            {usuarios.map((usuario) => (

                                                <tr
                                                    key={usuario.id}
                                                    className="hover:bg-gray-50 transition"
                                                >

                                                    {/* Usuário */}
                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div
                                                                className="
                                                    w-10
                                                    h-10
                                                    rounded-full
                                                    bg-gray-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                                            >
                                                                <IoPersonOutline
                                                                    size={20}
                                                                    className="text-gray-500"
                                                                />
                                                            </div>

                                                            <span className="font-medium text-gray-800">
                                                                {usuario.nome}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* E-mail */}
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {usuario.email}
                                                    </td>

                                                    {/* Role */}
                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`
                                                inline-flex
                                                px-2.5
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-medium
                                                ${getRoleClass(usuario.role)}
                                            `}
                                                        >
                                                            {getRoleLabel(usuario.role)}
                                                        </span>

                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                text-sm
                                                font-medium
                                                ${usuario.status === 1
                                                                    ? "text-green-600"
                                                                    : "text-gray-400"
                                                                }
                                            `}
                                                        >

                                                            <span
                                                                className={`w-2 h-2 rounded-full ${usuario.status === 1 ? "bg-green-500" : "bg-gray-400"}`}
                                                            />

                                                            {usuario.status == 1 ? 'Ativo' : 'Inativo'}

                                                        </span>

                                                    </td>

                                                    {/* Ações */}
                                                    <td className="px-6 py-4">

                                                        <div className="flex justify-end gap-2">

                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUsuario(usuario)
                                                                    setModalMode('update')
                                                                    handleModal()
                                                                }}
                                                                title="Editar"
                                                                className="
                                                    p-2
                                                    rounded-lg
                                                    text-gray-500
                                                    hover:text-blue-600
                                                    hover:bg-blue-50
                                                    transition
                                                "
                                                            >
                                                                <IoCreateOutline size={19} />
                                                            </button>

                                                            <button
                                                                title="Excluir"
                                                                className="
                                                    p-2
                                                    rounded-lg
                                                    text-gray-500
                                                    hover:text-red-600
                                                    hover:bg-red-50
                                                    transition
                                                "
                                                            >
                                                                <IoTrashOutline size={19} />
                                                            </button>

                                                        </div>

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
            {modalVisible ? <Modal Node={<UsuarioForm mode={modalMode} selectedUsuario={selectedUsuario}/>} title={modalMode == 'create' ? 'Novo usuário' : 'Editar usuário'} setModalVisible={handleModal} mode={modalMode} /> : null}
        </div>
        </SideBarLayout>
    );
}