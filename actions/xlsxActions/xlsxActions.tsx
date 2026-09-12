import { exportarExcel } from "@/services/Xlsx";

export function loadExcel(lines: any[], sheetName: string) {
  const sheet = exportarExcel(lines, sheetName);
}