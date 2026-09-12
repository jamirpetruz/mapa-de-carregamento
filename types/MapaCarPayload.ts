import { IMapaLinePayload } from "./MapaLinePayload";

export interface IMapaCarPayload {
    Code?: string;
    U_Veiculo: string;
    U_NPedido: number;
    U_Placa: string;
    U_Lacre: string;
    U_Motorista: string;
    U_DataLog: string;
    U_Transport: string;
    U_Cubagem: string;
    U_OBS: string;
    U_Data: string;
    MAP_CAR_LINCollection: IMapaLinePayload[];
}
