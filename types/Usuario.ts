export interface IUsuario {
    id: number | null
    nome: string
    email: string
    password: string
    role: string
    status: 0 | 1
}