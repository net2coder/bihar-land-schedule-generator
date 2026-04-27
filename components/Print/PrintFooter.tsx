"use client";

import { useScheduleStore } from "@/lib/store";
import { transliterateTrailingWord } from "@/lib/translator";
import type { MetadataFields } from "@/lib/types";

export function PrintFooter() {
  const metadata = useScheduleStore((state) => state.metadata);
  const updateMetadata = useScheduleStore((state) => state.updateMetadata);
  const transliteration = useScheduleStore((state) => state.transliteration);

  const update = (name: keyof MetadataFields, value: string) => {
    updateMetadata(name, transliteration && name === "amin" ? transliterateTrailingWord(value) : value);
  };

  return (
    <footer className="grid grid-cols-2 gap-8 border-t border-slate-900/70 p-4 print:p-2">
      <label className="field-line">
        <span>तिथि</span>
        <input
          type="date"
          value={metadata.date}
          onChange={(event) => update("date", event.target.value)}
        />
      </label>
      <label className="field-line justify-self-end">
        <span>अमीन का नाम</span>
        <input value={metadata.amin} onChange={(event) => update("amin", event.target.value)} />
      </label>
    </footer>
  );
}
