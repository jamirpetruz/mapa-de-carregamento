"use client"

import { createUsuarioAction, updateUsuarioAction } from "@/actions/usuarioActions/usuarioActions"
import { IUsuario } from "@/types/Usuario"
import { FormEvent, useState } from "react"
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoPersonOutline,
    IoMailOutline,
    IoLockClosedOutline,
    IoShieldCheckmarkOutline,
} from "react-icons/io5"

interface UsuarioFormProps {
    selectedUsuario: IUsuario | null
    mode: 'create' | 'update'
    onSubmit?: (data: IUsuario) => void
    onCancel?: () => void
}

export default function UsuarioForm({
    onSubmit,
    onCancel,
    selectedUsuario,
    mode
}: UsuarioFormProps) {

    const [mostrarSenha, setMostrarSenha] = useState(false)

    const [form, setForm] = useState<IUsuario>({
        id: selectedUsuario?.id ?? null,
        nome: selectedUsuario?.nome ?? '',
        email: selectedUsuario?.email ?? '',
        password: '',
        role: selectedUsuario?.role ?? '',
        status: selectedUsuario?.status ?? 1,
    })

    function handleChange<K extends keyof IUsuario>(
        field: K,
        value: IUsuario[K]
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (mode == 'create') {
            const result = await createUsuarioAction(form)
        } else {
            const result = await updateUsuarioAction(form)
            if (result) {
                alert('Usuário atualizado com sucesso')
            } else {
                alert('Falha ao atualizar usuário')
            }
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {/* Cabeçalho */}
            <div>
                <p className="text-sm text-gray-500 mt-1">
                    Informe os dados e permissões do usuário.
                </p>
            </div>

            {/* Formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Nome */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nome
                    </label>

                    <div className="relative">

                        <IoPersonOutline
                            size={19}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            type="text"
                            value={form.nome}
                            onChange={(event) =>
                                handleChange("nome", event.target.value)
                            }
                            placeholder="Nome completo"
                            className="
                                w-full
                                pl-10
                                pr-3
                                py-1
                                border
                                border-gray-300
                                rounded-lg
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            required
                        />

                    </div>
                </div>

                {/* E-mail */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        E-mail
                    </label>

                    <div className="relative">

                        <IoMailOutline
                            size={19}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                                handleChange("email", event.target.value)
                            }
                            placeholder="usuario@empresa.com"
                            className="
                                w-full
                                pl-10
                                pr-3
                                py-1
                                border
                                border-gray-300
                                rounded-lg
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            required
                        />

                    </div>
                </div>

                {/* Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Senha
                    </label>

                    <div className="relative">

                        <IoLockClosedOutline
                            size={19}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            type={mostrarSenha ? "text" : "password"}
                            value={form.password}
                            onChange={(event) =>
                                handleChange("password", event.target.value)
                            }
                            placeholder="Digite a senha"
                            className="
                                w-full
                                pl-10
                                pr-11
                                py-1
                                border
                                border-gray-300
                                rounded-lg
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                            required={!selectedUsuario?.id}
                            minLength={6}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setMostrarSenha((prev) => !prev)
                            }
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                                hover:text-gray-600
                            "
                        >
                            {mostrarSenha ? (
                                <IoEyeOffOutline size={20} />
                            ) : (
                                <IoEyeOutline size={20} />
                            )}
                        </button>

                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                        Mínimo de 6 caracteres.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Função
                    </label>

                    <div className="relative">

                        <IoShieldCheckmarkOutline
                            size={19}
                            className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                pointer-events-none
                z-10
            "
                        />

                        <select
                            value={form.role}
                            onChange={(event) =>
                                handleChange("role", event.target.value)
                            }
                            className="
                w-full
                pl-10
                pr-3
                py-1
                border
                border-gray-300
                rounded-lg
                bg-white
                outline-none
                appearance-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
            "
                        >
                            <option value="user">
                                Usuário
                            </option>

                            <option value="admin">
                                Administrador
                            </option>
                        </select>

                    </div>
                </div>

                {/* Status */}
                <div className="md:col-span-2">

                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Status
                    </label>

                    <select
                        value={form.status}
                        onChange={(event) =>
                            handleChange(
                                "status",
                                Number(event.target.value) as 0 | 1
                            )
                        }
                        className="
                            w-full
                            px-3
                            py-1.5
                            border
                            border-gray-300
                            rounded-lg
                            bg-white
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option value={1}>
                            Ativo
                        </option>

                        <option value={0}>
                            Inativo
                        </option>
                    </select>

                </div>

            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                    type="submit"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition"
                >
                    Salvar
                </button>

            </div>

        </form>
    )
}