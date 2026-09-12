// lib/auth.ts

import { getServerSession } from "next-auth"

export async function requireAuth() {

    const session = await getServerSession()

    if (!session?.user) {
        throw new Error("Não autorizado")
    }

    return session
}

export async function requireAdmin() {

    const session = await getServerSession()

    if (!session?.user) {
        throw new Error("Não autorizado")
    }

    if (session?.user.role != 'admin') {
        throw new Error("Não autorizado")
    }

    return session
}