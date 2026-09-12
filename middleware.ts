import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        
        const token = req.nextauth.token

        const pathname = req.nextUrl.pathname
        const role = token?.role

        // Somente admin
        if ((pathname.startsWith("/usuarios") || pathname.startsWith("/logs")) && role !== "admin") {
            return NextResponse.redirect(
                new URL("/403", req.url)
            )
        }

        // Admin e usuário
        if (
            pathname.startsWith("/relatorios") &&
            role !== "admin" &&
            role !== "user"
        ) {
            return NextResponse.redirect(
                new URL("/403", req.url)
            )
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/mapa-de-carregamento/:path*",
        "/consultas/:path*",
        "/relatorios/:path*",
        "/usuarios/:path*",
        "/logs/:path*"
    ],
} 