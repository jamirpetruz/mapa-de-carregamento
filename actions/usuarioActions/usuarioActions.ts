'use server'

import { requireAdmin, requireAuth } from "@/lib/auth";
import { createUsuario, findAllUsuarios, findUsuarioByEmail, updateUsuario } from "@/services/Usuario";
import { IUsuario } from "@/types/Usuario";

export async function createUsuarioAction(user: IUsuario){
    const session = await requireAuth()
    requireAdmin()
    const savedUser = await createUsuario(user)
    return savedUser
}

export async function findUsuarioByEmailAction(email: string){
    const session = await requireAuth()
    const userFound = await findUsuarioByEmail(email)
    return userFound
}

export async function findAllUsuariosAction(): Promise<IUsuario[]>{
    const session = await requireAuth()
    requireAdmin()
    const users = await findAllUsuarios()
    return users
}

export async function updateUsuarioAction(user: IUsuario): Promise<boolean>{
    const session = await requireAuth()
    const result = await updateUsuario(user)
    return result
}