import type { ScheduleRow, SortMode } from "@/lib/types";
import { toNumber } from "@/lib/calculator";

export function sortRowsByOriginalKhesra(rows: ScheduleRow[], mode: SortMode) {
  return [...rows].sort((a, b) => {
    const result = toNumber(a.original.khesra) - toNumber(b.original.khesra);
    return mode === "asc" ? result : -result;
  });
}
