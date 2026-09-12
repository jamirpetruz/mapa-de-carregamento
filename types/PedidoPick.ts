export interface IPedidoVendaPick{
    DocNum: number;
    DocDate: string;
    CardCode: string;
    CardName: string;
    NumAtCard: string | null;
    DocTotal: number;
    DocCurrency: string;
    BPLName: string;
}