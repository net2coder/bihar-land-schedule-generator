"use client";

import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { useScheduleStore } from "@/lib/store";
import type { BoundaryField, ParcelField, ScheduleRow } from "@/lib/types";
import { transliterateTrailingWord } from "@/lib/translator";

const parcelFields: Array<{ field: ParcelField; label: string; numeric?: boolean }> = [
  { field: "jamabandi", label: "जमाबंदी नं." },
  { field: "khata", label: "खाता नं." },
  { field: "khesra", label: "खेसरा नं." },
  { field: "area", label: "रकवा", numeric: true },
];

const divisionParcelFields = parcelFields.filter(({ field }) => field !== "jamabandi");

const boundaryFields: Array<{ field: BoundaryField; label: string }> = [
  { field: "north", label: "उ." },
  { field: "east", label: "पू." },
  { field: "south", label: "द." },
  { field: "west", label: "प." },
];

const boundaryRows = [
  [boundaryFields[0], boundaryFields[1]],
  [boundaryFields[2], boundaryFields[3]],
];

function normalize(field: ParcelField | BoundaryField, value: string, transliteration: boolean) {
  if (!transliteration || field === "area") {
    return value;
  }

  return transliterateTrailingWord(value);
}

function TableInput({
  value,
  onChange,
  onEnter,
  numeric = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  numeric?: boolean;
}) {
  return (
    <input
      className={numeric ? "numeric-input" : ""}
      inputMode={numeric ? "decimal" : "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onEnter?.();
        }
      }}
    />
  );
}

function AbhyuktiInput({
  value,
  onChange,
  transliteration = false,
}: {
  value: string;
  onChange: (value: string) => void;
  transliteration?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(44, textarea.scrollHeight)}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="abhyukti-textarea"
      rows={2}
      value={value}
      onChange={(event) =>
        onChange(transliteration ? transliterateTrailingWord(event.target.value) : event.target.value)
      }
    />
  );
}

function DivisionCells({
  row,
  index,
  onEnter,
}: {
  row: ScheduleRow;
  index: number;
  onEnter: () => void;
}) {
  const updateDivision = useScheduleStore((state) => state.updateDivision);
  const updateBoundary = useScheduleStore((state) => state.updateBoundary);
  const transliteration = useScheduleStore((state) => state.transliteration);
  const division = row.divisions[index];
  return (
    <>
      {divisionParcelFields.map(({ field, numeric }) => (
        <td key={field}>
          <TableInput
            numeric={numeric}
            value={division[field]}
            onEnter={onEnter}
            onChange={(value) =>
              updateDivision(row.id, index, field, normalize(field, value, transliteration))
            }
          />
        </td>
      ))}
      <td className="boundary-grid-cell">
        <table className="boundary-mini-table" aria-label="चौहद्दी">
          <tbody>
            {boundaryRows.map((boundaryRow, rowIndex) => (
              <tr key={rowIndex}>
                {boundaryRow.map(({ field, label }) => (
                  <td key={field}>
                    <label className="boundary-input">
                      <span>{label}</span>
                      <textarea
                        rows={2}
                        value={division.boundary[field]}
                        onChange={(event) =>
                          updateBoundary(
                            row.id,
                            index,
                            field,
                            normalize(field, event.target.value, transliteration),
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            onEnter();
                          }
                        }}
                      />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </>
  );
}

export function LandTable() {
  const rows = useScheduleStore((state) => state.rows);
  const personCount = useScheduleStore((state) => state.personCount);
  const divisionNames = useScheduleStore((state) => state.divisionNames);
  const updateOriginal = useScheduleStore((state) => state.updateOriginal);
  const updateDivisionName = useScheduleStore((state) => state.updateDivisionName);
  const updateAbhyukti = useScheduleStore((state) => state.updateAbhyukti);
  const addRow = useScheduleStore((state) => state.addRow);
  const deleteRow = useScheduleStore((state) => state.deleteRow);
  const transliteration = useScheduleStore((state) => state.transliteration);
  const showAbhyukti = useScheduleStore((state) => state.showAbhyukti);

  return (
    <div className="table-wrap">
      <table className="schedule-table">
        <colgroup>
          <col className="col-serial" />
          <col className="col-jamabandi" />
          <col className="col-khata" />
          <col className="col-khesra" />
          <col className="col-area" />
          {Array.from({ length: personCount }).flatMap((_, index) => [
            <col className="col-khata" key={`${index}-khata`} />,
            <col className="col-khesra" key={`${index}-khesra`} />,
            <col className="col-area" key={`${index}-area`} />,
            <col className="col-boundary" key={`${index}-boundary`} />,
          ])}
          {showAbhyukti ? <col className="col-abhyukti" /> : null}
          <col className="col-action no-print" />
        </colgroup>
        <thead>
          <tr>
            <th rowSpan={2} className="serial-col">
              क्र.
            </th>
            <th colSpan={4}>खतियानी रैयत</th>
            {Array.from({ length: personCount }).map((_, index) => (
              <th colSpan={4} key={index}>
                <label className="division-name-header">
                  <span>मद. नं. ({index + 1}) नाम</span>
                  <input
                    value={divisionNames[index]}
                    onChange={(event) =>
                      updateDivisionName(
                        index,
                        transliteration
                          ? transliterateTrailingWord(event.target.value)
                          : event.target.value,
                      )
                    }
                  />
                </label>
              </th>
            ))}
            <th rowSpan={2} className="action-col no-print">
              {showAbhyukti ? "अभ्युक्ति" : "कार्य"}
            </th>
          </tr>
          <tr>
            {parcelFields.map(({ label }) => (
              <th key={`original-${label}`}>{label}</th>
            ))}
            {Array.from({ length: personCount }).flatMap((_, divisionIndex) => [
              ...divisionParcelFields.map(({ label }) => (
                <th key={`${divisionIndex}-${label}`}>{label}</th>
              )),
              <th className="boundary-heading" key={`${divisionIndex}-boundary`}>
                चौहद्दी
              </th>,
            ])}
            {showAbhyukti && <th className="abhyukti-heading">कार्य</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td className="serial-col">{rowIndex + 1}</td>
              {parcelFields.map(({ field, numeric }) => (
                <td key={field}>
                  <TableInput
                    numeric={numeric}
                    value={row.original[field]}
                    onEnter={() => {
                      if (rowIndex === rows.length - 1) {
                        addRow();
                      }
                    }}
                    onChange={(value) =>
                      updateOriginal(row.id, field, normalize(field, value, transliteration))
                    }
                  />
                </td>
              ))}
              {Array.from({ length: personCount }).map((_, index) => (
                <DivisionCells
                  key={index}
                  row={row}
                  index={index}
                  onEnter={() => {
                    if (rowIndex === rows.length - 1) {
                      addRow();
                    }
                  }}
                />
              ))}
              {showAbhyukti ? (
                <td className="abhyukti-cell">
                  <AbhyuktiInput
                    value={row.abhyukti ?? ""}
                    onChange={(value) => updateAbhyukti(row.id, value)}
                    transliteration={transliteration}
                  />
                </td>
              ) : null}
              <td className="action-col no-print">
                <button
                  className="icon-button danger"
                  type="button"
                  title="Delete row"
                  onClick={() => deleteRow(row.id)}
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-row-strip no-print">
        <button className="tool-button" type="button" onClick={addRow}>
          नई पंक्ति जोड़ें
        </button>
      </div>
    </div>
  );
}
