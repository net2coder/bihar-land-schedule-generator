import type { ScheduleRow } from "@/lib/types";

export function toNumber(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatArea(value: number) {
  return Number(value.toFixed(4)).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export function getOriginalTotal(rows: ScheduleRow[]) {
  return rows.reduce((sum, row) => sum + toNumber(row.original.area), 0);
}

export function getDivisionTotal(rows: ScheduleRow[], divisionIndex: number) {
  return rows.reduce((sum, row) => sum + toNumber(row.divisions[divisionIndex].area), 0);
}

export function getAllDivisionTotal(rows: ScheduleRow[], personCount: number) {
  return rows.reduce((sum, row) => {
    return (
      sum +
      row.divisions.slice(0, personCount).reduce((divisionSum, division) => {
        return divisionSum + toNumber(division.area);
      }, 0)
    );
  }, 0);
}

export function totalsMatch(original: number, divisions: number) {
  return Math.abs(original - divisions) < 0.0001;
}
