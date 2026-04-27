"use client";

import { ArrowDownNarrowWide, ArrowUpNarrowWide, Languages, Plus, Printer } from "lucide-react";
import { useScheduleStore } from "@/lib/store";

export function Toolbar() {
  const personCount = useScheduleStore((state) => state.personCount);
  const setPersonCount = useScheduleStore((state) => state.setPersonCount);
  const transliteration = useScheduleStore((state) => state.transliteration);
  const setTransliteration = useScheduleStore((state) => state.setTransliteration);
  const addRow = useScheduleStore((state) => state.addRow);
  const sortRows = useScheduleStore((state) => state.sortRows);

  return (
    <div className="no-print sticky top-0 z-10 mb-3 flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-sm">
      <div className="segmented-control" aria-label="व्यक्ति संख्या">
        <button
          className={personCount === 2 ? "active" : ""}
          type="button"
          onClick={() => setPersonCount(2)}
        >
          2 व्यक्ति
        </button>
        <button
          className={personCount === 3 ? "active" : ""}
          type="button"
          onClick={() => setPersonCount(3)}
        >
          3 व्यक्ति
        </button>
      </div>

      <button
        className={`tool-button ${transliteration ? "active" : ""}`}
        type="button"
        onClick={() => setTransliteration(!transliteration)}
        title="Hindi transliteration"
      >
        <Languages size={16} />
        हिंदी
      </button>

      <button className="tool-button" type="button" onClick={() => sortRows("asc")} title="Sort khesra ascending">
        <ArrowUpNarrowWide size={16} />
        खेसरा
      </button>
      <button className="tool-button" type="button" onClick={() => sortRows("desc")} title="Sort khesra descending">
        <ArrowDownNarrowWide size={16} />
        खेसरा
      </button>

      <button className="tool-button" type="button" onClick={addRow}>
        <Plus size={16} />
        पंक्ति
      </button>

      <button className="tool-button primary ml-auto" type="button" onClick={() => window.print()}>
        <Printer size={16} />
        प्रिंट
      </button>
    </div>
  );
}
