"use client";

import type { BoundaryField } from "@/lib/types";

const labels: Record<BoundaryField, string> = {
  north: "उ.",
  south: "द.",
  east: "पू.",
  west: "प.",
};

type BoundaryInputProps = {
  field: BoundaryField;
  value: string;
  onChange: (value: string) => void;
};

export function BoundaryInput({ field, value, onChange }: BoundaryInputProps) {
  return (
    <label className="boundary-cell">
      <span>{labels[field]}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
