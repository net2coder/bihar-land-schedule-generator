"use client";

import { ArrowDownNarrowWide, ArrowUpNarrowWide, Languages, Plus, Printer } from "lucide-react";
import { useScheduleStore } from "@/lib/store";
import type { Orientation, PaperSize } from "@/lib/types";

export function Toolbar() {
  const personCount = useScheduleStore((state) => state.personCount);
  const setPersonCount = useScheduleStore((state) => state.setPersonCount);
  const transliteration = useScheduleStore((state) => state.transliteration);
  const setTransliteration = useScheduleStore((state) => state.setTransliteration);
  const addRow = useScheduleStore((state) => state.addRow);
  const sortRows = useScheduleStore((state) => state.sortRows);
  const printSettings = useScheduleStore((state) => state.printSettings);
  const setPrintSettings = useScheduleStore((state) => state.setPrintSettings);

  return (
    <div className="no-print sticky top-4 z-20 mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-md backdrop-blur-md transition-all">
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
        <Languages size={18} />
        हिंदी
      </button>

      <button className="tool-button" type="button" onClick={() => sortRows("asc")} title="Sort khesra ascending">
        <ArrowUpNarrowWide size={18} />
        खेसरा
      </button>
      <button className="tool-button" type="button" onClick={() => sortRows("desc")} title="Sort khesra descending">
        <ArrowDownNarrowWide size={18} />
        खेसरा
      </button>

      <button className="tool-button" type="button" onClick={addRow}>
        <Plus size={18} />
        पंक्ति
      </button>

      <div className="ml-auto mr-1 flex items-center gap-2">
        <select
          className="h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition-all hover:bg-slate-50 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          value={printSettings.paperSize}
          onChange={(e) => setPrintSettings({ paperSize: e.target.value as PaperSize })}
        >
          <option value="A4">A4</option>
          <option value="A3">A3</option>
          <option value="Letter">Letter</option>
        </select>
        <select
          className="h-[38px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition-all hover:bg-slate-50 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          value={printSettings.orientation}
          onChange={(e) => setPrintSettings({ orientation: e.target.value as Orientation })}
        >
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
        </select>
      </div>

      <button className="tool-button primary" type="button" onClick={() => window.print()}>
        <Printer size={18} />
        प्रिंट
      </button>
    </div>
  );
}
