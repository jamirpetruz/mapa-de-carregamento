'use client'

import { useEffect, useRef, useState } from "react"
import { IoPersonCircleOutline } from "react-icons/io5"
import { IoIosLogOut, IoIosMenu } from "react-icons/io"
import { signOut, useSession } from "next-auth/react"
import { UserProfilePopover } from "./UserProfilePopover"
import { SideBar } from "../sideBar/SideBar"

export function SideBarLayout({ children }: { children: React.ReactNode }) {

    const { data: session } = useSession()

    const [perfilAberto, setPerfilAberto] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const perfilRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        function handleClickFora(event: MouseEvent) {

            if (
                perfilRef.current &&
                !perfilRef.current.contains(event.target as Node)
            ) {
                setPerfilAberto(false)
            }
        }

        document.addEventListener("mousedown", handleClickFora)

        return () => {
            document.removeEventListener("mousedown", handleClickFora)
        }

    }, [])

    const handleSideBar = () => {
        setSidebarCollapsed(prev => !prev)
    }

    return (
        <>
            <header className="h-[60px] w-full bg-slate-900 flex items-center justify-between px-4 md:px-6">

                {/* Lado esquerdo */}
                <div className="flex items-center gap-4">

                    {/* Menu */}
                    <button
                        onClick={handleSideBar}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                    >
                        <IoIosMenu size={28} />
                    </button>

                    {/* Logo / título */}
                    <div className="flex items-center gap-3">

                        <div className="hidden sm:block">

                            <h1 className="font-semibold text-white">
                                Mapa de Carregamento
                            </h1>

                            <p className="text-xs text-gray-400">
                                Sistema de gerenciamento
                            </p>

                        </div>

                    </div>

                </div>

                {/* Lado direito */}
                <div className="flex items-center gap-2">

                    {/* Usuário */}
                    <div
                        className="relative"
                        ref={perfilRef}
                    >

                        <button
                            onClick={() =>
                                setPerfilAberto(aberto => !aberto)
                            }
                            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-950 transition cursor-pointer"
                        >

                            <IoPersonCircleOutline
                                size={32}
                                className="text-white"
                            />

                            <div className="hidden md:block text-left">

                                <p className="text-sm font-medium text-white">
                                    {session?.user.name}
                                </p>

                                <p
                                    className={`text-xs ${session?.user.role === 'admin'
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                        }`}
                                >
                                    {session?.user.role === 'admin'
                                        ? 'Administrador'
                                        : 'Usuário'}
                                </p>

                            </div>

                        </button>

                        {perfilAberto && session?.user && (
                            <UserProfilePopover
                                nome={session.user.name ?? "Usuário"}
                                email={session.user.email ?? ""}
                                perfilAcesso={session.user.role ?? "user"}
                            />
                        )}

                    </div>

                    {/* Logout */}
                    <button
                        className="relative p-2.5 rounded-lg hover:bg-slate-800 transition"
                        onClick={() => {
                            signOut({ callbackUrl: '/' })
                        }}
                    >
                        <IoIosLogOut
                            size={22}
                            className="text-red-600 cursor-pointer"
                        />
                    </button>

                </div>

            </header>
            <div className="flex h-[calc(100vh-60px)]">

                <SideBar collapsed={sidebarCollapsed} />

                <main
                    className={`
                        flex-1
                        min-w-0
                        overflow-auto
                        transition-all duration-300 ease-in-out
                    `}
                >
                    {children}
                </main>

            </div>
        </>
    )
}