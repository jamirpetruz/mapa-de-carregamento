import { findUsuarioByEmail } from "@/services/Usuario"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { setSapSession } from "@/lib/sap/session"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: {
                    label: "E-mail",
                    type: "email",
                    placeholder: "seu@email.com",
                },

                password: {
                    label: "Senha",
                    type: "password",
                },

            },

            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email
                const password = credentials.password

                const user = await findUsuarioByEmail(email)

                if (!user) {
                    return null
                }

                const passwordValid = await bcrypt.compare(
                    password,
                    user.password
                )

                if (!passwordValid) {
                    return null
                }

                return {
                    id: String(user.id),
                    email: user.email,
                    role: user.role,
                    name: user.nome
                }
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.id = user.id
                token.role = user.role
            }

            return token
        },

        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }

            return session
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }