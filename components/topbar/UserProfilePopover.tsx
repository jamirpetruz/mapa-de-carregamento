'use client'

import { FiMail, FiShield, FiUser } from "react-icons/fi"

interface UserProfilePopoverProps {
    nome: string
    email: string
    perfilAcesso: string
}

export function UserProfilePopover({ nome, email, perfilAcesso }: UserProfilePopoverProps) {
    return (
        <div className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg z-50">
            {/* Cabeçalho com avatar */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-600">
                    {nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-800">
                        {nome}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                        {email}
                    </p>
                </div>
            </div>

            {/* Informações */}
            <div className="flex flex-col gap-3 p-4">
                <div>
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        <FiUser size={12} />
                        Nome
                    </span>
                    <p className="text-sm text-gray-800">
                        {nome}
                    </p>
                </div>

                <div>
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        <FiMail size={12} />
                        E-mail
                    </span>
                    <p className="text-sm text-gray-800">
                        {email}
                    </p>
                </div>

                <div>
                    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        <FiShield size={12} />
                        Perfil de acesso
                    </span>
                    <p className="text-sm capitalize text-gray-800">
                        {perfilAcesso}
                    </p>
                </div>
            </div>
        </div>
    )
}