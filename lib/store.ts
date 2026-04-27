"use client";

import { create } from "zustand";
import type {
  BoundaryField,
  DivisionParcel,
  MetadataFields,
  Orientation,
  PaperSize,
  Parcel,
  ParcelField,
  PersonCount,
  PrintSettings,
  ScheduleRow,
  SortMode,
} from "@/lib/types";
import { sortRowsByOriginalKhesra } from "@/lib/sorter";

const emptyParcel = (): Parcel => ({
  jamabandi: "",
  khata: "",
  khesra: "",
  area: "",
});

const emptyDivision = (): DivisionParcel => ({
  ...emptyParcel(),
  boundary: {
    north: "",
    south: "",
    east: "",
    west: "",
  },
});

const createRow = (): ScheduleRow => ({
  id: crypto.randomUUID(),
  original: emptyParcel(),
  divisions: [emptyDivision(), emptyDivision(), emptyDivision()],
});

type ScheduleState = {
  rows: ScheduleRow[];
  metadata: MetadataFields;
  divisionNames: [string, string, string];
  personCount: PersonCount;
  transliteration: boolean;
  printSettings: PrintSettings;
  updateMetadata: (field: keyof MetadataFields, value: string) => void;
  updateDivisionName: (index: number, value: string) => void;
  setPersonCount: (count: PersonCount) => void;
  setTransliteration: (enabled: boolean) => void;
  setPrintSettings: (settings: Partial<{ paperSize: PaperSize; orientation: Orientation }>) => void;
  updateOriginal: (rowId: string, field: ParcelField, value: string) => void;
  updateDivision: (rowId: string, index: number, field: ParcelField, value: string) => void;
  updateBoundary: (rowId: string, index: number, field: BoundaryField, value: string) => void;
  addRow: () => void;
  deleteRow: (rowId: string) => void;
  sortRows: (mode: SortMode) => void;
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  rows: [createRow(), createRow(), createRow(), createRow()],
  metadata: {
    mauza: "",
    thanaNo: "",
    anchal: "",
    rajasvThana: "",
    policeThana: "",
    halka: "",
    district: "",
    raiyat: "",
    date: new Date().toISOString().slice(0, 10),
    amin: "",
  },
  divisionNames: ["", "", ""],
  personCount: 2,
  transliteration: true,
  printSettings: { paperSize: "A4", orientation: "landscape" },
  updateMetadata: (field, value) =>
    set((state) => ({
      metadata: { ...state.metadata, [field]: value },
    })),
  updateDivisionName: (index, value) =>
    set((state) => ({
      divisionNames: state.divisionNames.map((name, nameIndex) =>
        nameIndex === index ? value : name,
      ) as [string, string, string],
    })),
  setPersonCount: (count) => set({ personCount: count }),
  setTransliteration: (enabled) => set({ transliteration: enabled }),
  setPrintSettings: (settings) =>
    set((state) => ({ printSettings: { ...state.printSettings, ...settings } })),
  updateOriginal: (rowId, field, value) =>
    set((state) => ({
      rows: state.rows.map((row) =>
        row.id === rowId
          ? { ...row, original: { ...row.original, [field]: value } }
          : row,
      ),
    })),
  updateDivision: (rowId, index, field, value) =>
    set((state) => ({
      rows: state.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              divisions: row.divisions.map((division, divisionIndex) =>
                divisionIndex === index ? { ...division, [field]: value } : division,
              ) as ScheduleRow["divisions"],
            }
          : row,
      ),
    })),
  updateBoundary: (rowId, index, field, value) =>
    set((state) => ({
      rows: state.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              divisions: row.divisions.map((division, divisionIndex) =>
                divisionIndex === index
                  ? {
                      ...division,
                      boundary: { ...division.boundary, [field]: value },
                    }
                  : division,
              ) as ScheduleRow["divisions"],
            }
          : row,
      ),
    })),
  addRow: () => set((state) => ({ rows: [...state.rows, createRow()] })),
  deleteRow: (rowId) =>
    set((state) => ({
      rows: state.rows.length > 1 ? state.rows.filter((row) => row.id !== rowId) : state.rows,
    })),
  sortRows: (mode) => set((state) => ({ rows: sortRowsByOriginalKhesra(state.rows, mode) })),
}));
