'use client'
import { findRomaneioByCodeAction } from "@/actions/romaneioActions/romaneioActions";
import { IRomaneio } from "@/types/Romaneio";
import { useEffect, useState } from "react";
import './romaneio.css'
import { findPedidoCurrencyAction } from "@/actions/pedidoActions/pedidoActions";

export default function RelatorioRomaneio() {

    const [rom, setRom] = useState<IRomaneio>()
    const [currency, setCurrency] = useState<string>('')
    
    useEffect(() => {

        const url = new URLSearchParams(location.search);
        const code = url.get('code');

        const loadRomaneio = async () => {
            if (!code) return;
            const romaneio = await findRomaneioByCodeAction(code)
            setRom(romaneio)
            const currency = await findPedidoCurrencyAction(romaneio.U_NPedido)
            setCurrency(currency)
        }
        loadRomaneio()

    }, [])
    return (
        <div className="relatorio">

            {/* CABEÇALHO */}
            <div className="header">
                <table className="header-table">
                    <tbody>
                        <tr>
                            <td>
                                <div className="titulo">
                                    ROMANEIO DE ENTREGA
                                </div>

                                <div className="subtitulo">
                                    Relatório de carregamento e transporte
                                </div>
                            </td>

                            <td className="codigo">
                                Código<br />

                                <span className="codigo-valor">
                                    {rom?.Code}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            {/* DADOS DO CARREGAMENTO */}
            <div className="section">

                <div className="section-title">
                    Dados do carregamento
                </div>

                <table className="info-table">
                    <tbody>
                        <tr>

                            <td className="info" width="25%">
                                <span className="label">
                                    Data
                                </span>

                                <span className="value">
                                    {rom?.U_Data
                                        ? new Date(rom.U_Data).toLocaleDateString()
                                        : ''
                                    }
                                </span>
                            </td>

                            <td className="info" width="25%">
                                <span className="label">
                                    Nº Pedido
                                </span>

                                <span className="value">
                                    {rom?.U_NPedido}
                                </span>
                            </td>

                            <td className="info" width="25%">
                                <span className="label">
                                    Invoice
                                </span>

                                <span className="value">
                                    {rom?.U_Invoice}
                                </span>
                            </td>

                            <td className="info" width="25%">
                                <span className="label">
                                    Cliente
                                </span>

                                <span className="value">
                                    {rom?.U_CardName}
                                </span>
                            </td>

                        </tr>
                    </tbody>
                </table>

            </div>


            {/* TRANSPORTE */}
            <div className="section">

                <div className="section-title">
                    Transporte
                </div>

                <table className="info-table">
                    <tbody>

                        <tr>

                            <td className="info" width="25%">
                                <span className="label">
                                    Veículo
                                </span>

                                <span className="value">
                                    {rom?.U_Veiculo}
                                </span>
                            </td>

                            <td className="info" width="25%">
                                <span className="label">
                                    Placa
                                </span>

                                <span className="value">
                                    {rom?.U_Placa}
                                </span>
                            </td>

                            <td className="info" width="25%">
                                <span className="label">
                                    Transportadora
                                </span>

                                <span className="value">
                                    {rom?.U_Transport}
                                </span>
                            </td>

                            <td className="info" width="25%">
                                <span className="label">
                                    Motorista
                                </span>

                                <span className="value">
                                    {rom?.U_Motorista}
                                </span>
                            </td>

                        </tr>

                        <tr>

                            <td className="info">
                                <span className="label">
                                    Lacre
                                </span>

                                <span className="value">
                                    {rom?.U_Lacre}
                                </span>
                            </td>

                            <td className="info">
                                <span className="label">
                                    DataLog
                                </span>

                                <span className="value">
                                    {rom?.U_DataLog}
                                </span>
                            </td>

                            <td className="info"></td>
                            <td className="info"></td>

                        </tr>

                    </tbody>
                </table>

            </div>


            {/* ENDEREÇO */}
            <div className="section">

                <div className="section-title">
                    Endereço de entrega
                </div>

                <div className="address">

                    <strong>
                        {rom?.U_CardName}
                    </strong>

                    <br />

                    {rom?.U_Rua}, {rom?.U_Bairro}

                    <br />

                    {rom?.U_Cidade} - {rom?.U_Pais}

                    <br />

                    CEP: {rom?.U_Cep}

                </div>

            </div>


            {/* TOTAIS */}
            <div className="section">

                <div className="section-title">
                    Totais do carregamento
                </div>

                <table className="totais-table">
                    <tbody>
                        <tr>

                            <td className="total-box">

                                <div className="total-label">
                                    Quantidade
                                </div>

                                <div className="total-value">
                                    {Number(rom?.Quant_Geral).toFixed(2)}
                                </div>

                            </td>

                            <td className="total-box">

                                <div className="total-label">
                                    Paletes
                                </div>

                                <div className="total-value">
                                    {Number(rom?.Palet_Geral).toFixed(2)}
                                </div>

                            </td>

                            <td className="total-box">

                                <div className="total-label">
                                    Nº Paletes
                                </div>

                                <div className="total-value">
                                    {rom?.U_NPalet}
                                </div>

                            </td>

                            <td className="total-box">

                                <div className="total-label">
                                    Peso Líquido
                                </div>

                                <div className="total-value">
                                    {Number(rom?.Liq_Geral).toFixed(2)} kg
                                </div>

                            </td>

                            <td className="total-box">

                                <div className="total-label">
                                    Peso Bruto
                                </div>

                                <div className="total-value">
                                    {Number(rom?.Bru_Geral).toFixed(2)} kg
                                </div>

                            </td>

                        </tr>
                    </tbody>
                </table>

            </div>


            {/* VALOR */}
            <div className="section">

                <div className="section-title">
                    Valor do carregamento
                </div>

                <table className="valor-table">
                    <tbody>
                        <tr>
                            <td className="valor">

                                <span className="label">
                                    Total Geral
                                </span>

                                <span className="value">
                                     {currency} {Number(rom?.Total_Geral).toFixed(2)}
                                </span>

                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>


            {/* ASSINATURAS */}
            <table className="assinaturas">
                <tbody>
                    <tr>

                        <td className="assinatura">
                            Motorista
                        </td>

                        <td width="5%"></td>

                        <td className="assinatura">
                            Conferente
                        </td>

                        <td width="5%"></td>

                        <td className="assinatura">
                            Responsável
                        </td>

                    </tr>
                </tbody>
            </table>


            {/* RODAPÉ */}
            <div className="footer">

                <table className="footer-table">
                    <tbody>
                        <tr>

                            <td>
                                Mapa de Carregamento
                            </td>

                            <td className="center">
                                Pedido: {rom?.U_NPedido}
                            </td>

                            <td className="right">
                                Código: {rom?.Code}
                            </td>

                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
    );
}