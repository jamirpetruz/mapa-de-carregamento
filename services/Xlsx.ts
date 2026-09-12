import * as XLSX from "xlsx";

export function exportarExcel(lines: any[], sheetName: string) {
  const worksheet = XLSX.utils.json_to_sheet(lines);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Mapa"
  );

  XLSX.writeFile(workbook, `${sheetName}.xlsx`);
};