'use client'

import { Accordion } from "@heroui/react"
import { useSession } from "next-auth/react"
import { FaRegUserCircle, FaTruckLoading } from "react-icons/fa"
import { LuLogs } from "react-icons/lu"
import { TbReport } from "react-icons/tb"

interface SideBarProps {
    collapsed: boolean
}

export function SideBar({ collapsed }: SideBarProps) {

    const { data: session } = useSession()

    const SIDEBAR_ITEM_CLASS =
        "w-full h-12 px-4 flex items-center text-left text-sm font-medium cursor-pointer"

    const SIDEBAR_ICON_CLASS =
        "w-5 min-w-5 flex justify-center"

    return (
        <aside
            className={`
                top-[60px]
                left-0
                z-100
                h-[calc(100vh-60px)]
                flex
                flex-col
                justify-between
                bg-slate-800
                border-r
                transition-all
                duration-300
                ease-in-out
                overflow-hidden
                ${collapsed ? "w-[0px]" : "w-[240px]"}
            `}
        >

            {/* Menu */}
            <nav className="w-full">

                {/* Mapa de Carregamento */}
                <a
                    href="/mapa-de-carregamento"
                    className={`${SIDEBAR_ITEM_CLASS} text-white hover:bg-slate-900`}
                >

                    <span className={SIDEBAR_ICON_CLASS}>
                        <FaTruckLoading size={18} />
                    </span>

                    <span
                        className={`
                            ml-3
                            whitespace-nowrap
                            transition-all
                            duration-200
                            ${collapsed
                                ? "opacity-0 w-0 ml-0"
                                : "opacity-100 w-auto ml-3"
                            }
                        `}
                    >
                        Mapa de Carregamento
                    </span>

                </a>

                {/* Consultas */}
                <Accordion className="w-full p-0">
                    <Accordion.Item className="w-full">

                        <Accordion.Heading>

                            <Accordion.Trigger
                                className={`${SIDEBAR_ITEM_CLASS} text-white hover:bg-slate-900`}
                            >

                                <span className="flex items-center w-full">

                                    <span className={SIDEBAR_ICON_CLASS}>
                                        <TbReport size={20} />
                                    </span>

                                    <span
                                        className={`
                                            whitespace-nowrap
                                            transition-all
                                            duration-200
                                            ${collapsed
                                                ? "opacity-0 w-0 ml-0"
                                                : "opacity-100 w-auto ml-3"
                                            }
                                        `}
                                    >
                                        Consultas
                                    </span>

                                </span>

                            </Accordion.Trigger>

                        </Accordion.Heading>

                        <Accordion.Panel className="bg-slate-500">

                            <Accordion.Body className="p-0 m-0">

                                <a
                                    href="/consultas/mapa-de-carregamento"
                                    className="w-full h-10 px-4 pl-12 flex items-center text-sm text-white hover:bg-slate-700"
                                >
                                    Mapa de Carregamento
                                </a>

                                <a
                                    href="/consultas/romaneio"
                                    className="w-full h-10 px-4 pl-12 flex items-center text-sm text-white hover:bg-slate-700"
                                >
                                    Romaneio
                                </a>

                            </Accordion.Body>

                        </Accordion.Panel>

                    </Accordion.Item>
                </Accordion>

                {/* Usuários */}
                {session?.user.role === 'admin' && (
                    <span>
                        <a
                            href="/usuarios"
                            className={`${SIDEBAR_ITEM_CLASS} text-yellow-500 hover:bg-slate-900`}
                        >

                            <span className={SIDEBAR_ICON_CLASS}>
                                <FaRegUserCircle size={18} />
                            </span>

                            <span
                                className={`
                                whitespace-nowrap
                                transition-all
                                duration-200
                                ${collapsed
                                        ? "opacity-0 w-0 ml-0"
                                        : "opacity-100 w-auto ml-3"
                                    }
                            `}
                            >
                                Usuários
                            </span>

                        </a>

                        <a
                            href="/logs"
                            className={`${SIDEBAR_ITEM_CLASS} text-yellow-500 hover:bg-slate-900`}
                        >

                            <span className={SIDEBAR_ICON_CLASS}>
                                <LuLogs size={18} />
                            </span>

                            <span
                                className={`
                                whitespace-nowrap
                                transition-all
                                duration-200
                                ${collapsed
                                        ? "opacity-0 w-0 ml-0"
                                        : "opacity-100 w-auto ml-3"
                                    }
                            `}
                            >
                                Logs
                            </span>

                        </a>
                    </span>

                )}

            </nav>

            {/* Rodapé */}
            <div className="w-full p-2" />

        </aside>
    )
}