'use server'
import { requireAuth } from "@/lib/auth";
import { saveMapaDeCarregamento, updateMapaHana } from "@/services/MapaDeCarregamento";
import { proximoCode } from "@/services/ProximoCode";
import { IMapaCab } from "@/types/MapaCab";
import { IMapaLine } from "@/types/MapaLine";
import { IMapaLinePayload } from "@/types/MapaLinePayload";

export async function saveMapa(cab: IMapaCab, lines: IMapaLinePayload[], usuario_id: string) {
    const session = await requireAuth()
    const result = await saveMapaDeCarregamento(cab, lines, usuario_id);
    if (result) {
        return {
            success: true,
            msg: 'Mapa cadastrado com sucesso !'
        }
    }
    return {
        success: false,
        msg: 'Falha ao cadastrar mapa de carregamento'
    }
}

export async function updateMapaAction(cab: IMapaCab, lines: IMapaLinePayload[], usuario_id: string) {
    const session = await requireAuth()
    const result = await updateMapaHana(cab, lines, usuario_id);
    if (result) {
        return {
            success: true,
            msg: 'Mapa atualizado com sucesso !'
        }
    }
    return {
        success: false,
        msg: 'Falha ao atualizar mapa de carregamento'
    }
}

export async function proximoCodeAction(){
    const result = await proximoCode()
    return result
}