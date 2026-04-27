"use client";

import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  formatArea,
  getAllDivisionTotal,
  getDivisionTotal,
  getOriginalTotal,
  totalsMatch,
} from "@/lib/calculator";
import { useScheduleStore } from "@/lib/store";

export function TotalsBar() {
  const rows = useScheduleStore((state) => state.rows);
  const personCount = useScheduleStore((state) => state.personCount);
  const originalTotal = getOriginalTotal(rows);
  const allDivisionTotal = getAllDivisionTotal(rows, personCount);
  const valid = totalsMatch(originalTotal, allDivisionTotal);

  return (
    <div className="totals-strip">
      <div>
        <span>कुल मूल रकवा</span>
        <strong>{formatArea(originalTotal)}</strong>
      </div>
      {Array.from({ length: personCount }).map((_, index) => (
        <div key={index}>
          <span>मद. नं. ({index + 1})</span>
          <strong>{formatArea(getDivisionTotal(rows, index))}</strong>
        </div>
      ))}
      <div className={valid ? "total-valid" : "total-invalid"}>
        {valid ? <CheckCircle2 size={16} /> : <CircleAlert size={16} />}
        <span>{valid ? "मिलान सही" : "मिलान शेष"}</span>
        <strong>{formatArea(allDivisionTotal - originalTotal)}</strong>
      </div>
    </div>
  );
}
