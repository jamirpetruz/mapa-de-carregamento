"use client"

import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    IoEyeOutline,
    IoEyeOffOutline,
    IoMailOutline,
    IoLockClosedOutline,
} from "react-icons/io5"

export default function LoginPage() {

    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        setError("")
        setLoading(true)

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        setLoading(false)

        if (result?.error) {
            setError("E-mail ou senha inválidos.")
            return
        }

        router.push("/mapa-de-carregamento")
        router.refresh()
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo / Identidade */}
                <div className="text-center mb-8">

                    <div className="flex justify-center mb-4">

                        <div
                            className="
                                w-14
                                h-14
                                bg-blue-600
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                shadow-sm
                            "
                        >
                            <span className="text-white text-2xl font-bold">
                                M
                            </span>
                        </div>

                    </div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Mapa de Carregamento
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Acesse o sistema para continuar
                    </p>

                </div>

                {/* Card */}
                <div
                    className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-sm
                        p-6
                    "
                >

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* E-mail */}
                        <div>

                            <label
                                htmlFor="email"
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-1.5
                                "
                            >
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
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="usuario@empresa.com"
                                    autoComplete="email"
                                    required
                                    className="
                                        w-full
                                        pl-10
                                        pr-3
                                        py-2.5
                                        border
                                        border-gray-300
                                        rounded-lg
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />

                            </div>

                        </div>

                        {/* Senha */}
                        <div>

                            <div className="flex items-center justify-between mb-1.5">

                                <label
                                    htmlFor="password"
                                    className="
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Senha
                                </label>

                                <button
                                    type="button"
                                    className="
                                        text-xs
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    Esqueci minha senha
                                </button>

                            </div>

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
                                    id="password"
                                    type={
                                        mostrarSenha
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Digite sua senha"
                                    autoComplete="current-password"
                                    required
                                    className="
                                        w-full
                                        pl-10
                                        pr-11
                                        py-2.5
                                        border
                                        border-gray-300
                                        rounded-lg
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMostrarSenha(
                                            (prev) => !prev
                                        )
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

                        </div>

                        {/* Erro */}
                        {error && (
                            <div
                                className="
                                    bg-red-50
                                    border
                                    border-red-200
                                    text-red-600
                                    text-sm
                                    rounded-lg
                                    px-3
                                    py-2.5
                                "
                            >
                                {error}
                            </div>
                        )}

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                py-2.5
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:bg-blue-400
                                text-white
                                rounded-lg
                                font-medium
                                transition
                            "
                        >
                            {loading
                                ? "Entrando..."
                                : "Entrar"
                            }
                        </button>

                    </form>

                </div>

                {/* Rodapé */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © 2026 Mapa de Carregamento
                </p>

            </div>

        </main>
    )
}