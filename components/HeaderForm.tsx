"use client";

import { useScheduleStore } from "@/lib/store";
import type { MetadataFields } from "@/lib/types";
import { transliterateTrailingWord } from "@/lib/translator";

const fields: Array<{ label: string; name: keyof MetadataFields; wide?: boolean; type?: string }> = [
  { label: "मौजा", name: "mauza" },
  { label: "थाना नं.", name: "thanaNo" },
  { label: "जिला", name: "district" },
  { label: "अंचल", name: "anchal" },
  { label: "राजस्व थाना", name: "rajasvThana" },
  { label: "पुलिस थाना", name: "policeThana" },
  { label: "हल्का", name: "halka" },
  { label: "रैयत का नाम व पता", name: "raiyat", wide: true },
];

export function HeaderForm() {
  const metadata = useScheduleStore((state) => state.metadata);
  const updateMetadata = useScheduleStore((state) => state.updateMetadata);
  const transliteration = useScheduleStore((state) => state.transliteration);

  const update = (name: keyof MetadataFields, value: string) => {
    const nextValue = transliteration && name !== "thanaNo" ? transliterateTrailingWord(value) : value;
    updateMetadata(name, nextValue);
  };

  return (
    <header className="print-header">
      <h1>आपसी बंटवारा</h1>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-4 print:mt-2 print:grid-cols-4 print:gap-y-1 print:gap-x-4">
        {fields.map((field) => (
          <label
            className={`field-line ${field.wide ? "md:col-span-2 print:col-span-2" : ""}`}
            key={field.name}
          >
            <span>{field.label}</span>
            <input
              value={metadata[field.name]}
              onChange={(event) => update(field.name, event.target.value)}
            />
          </label>
        ))}
      </div>
    </header>
  );
}
