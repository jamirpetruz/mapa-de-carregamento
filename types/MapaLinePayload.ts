export interface IMapaLinePayload {
    id?: string;
    Code?: string;
    U_CodItem: string;
    U_Lote: string;
    U_Invoice?: string;
    U_CodClient: string;
    U_CardName: string;
    U_DescItem: string;
    U_Unidade: string;
    U_Quant: number;
    U_Preco: number;
    U_Total: number;
    U_Fabric: string;
    U_Validade: string;
    U_Cidade: string;
    U_Pais: string;
    U_Bairro: string;
    U_Cep: string;
    U_Rua: string;
    U_Deposito: string;
    U_PPalet: number;
    U_PRef: number;
    U_PLiq: number;
    U_PBru: number;
    U_NPalet: number;
    LineId?: number;
}