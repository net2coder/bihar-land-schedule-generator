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
import {
  saveStateToStorage,
  restoreStateFromStorage,
  clearStorage,
  isStorageAvailable,
} from "@/lib/storage";

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
  clearData: () => void;
  restoreData: () => void;
};

const defaultState = {
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
  divisionNames: ["", "", ""] as [string, string, string],
  personCount: 2 as PersonCount,
  transliteration: true,
  printSettings: { paperSize: "A4", orientation: "landscape" } as PrintSettings,
};

// Get initial state from storage or use defaults
const getInitialState = () => {
  if (typeof window === "undefined") return defaultState;
  if (!isStorageAvailable()) return defaultState;

  const restored = restoreStateFromStorage();
  return restored || defaultState;
};

export const useScheduleStore = create<ScheduleState>((set) => {
  // Set up auto-save listener
  const saveState = (state: ScheduleState) => {
    if (isStorageAvailable()) {
      saveStateToStorage({
        rows: state.rows,
        metadata: state.metadata,
        divisionNames: state.divisionNames,
        personCount: state.personCount,
        transliteration: state.transliteration,
        printSettings: state.printSettings,
      });
    }
  };

  return {
    ...getInitialState(),
    updateMetadata: (field, value) =>
      set((state) => {
        const newState = {
          ...state,
          metadata: { ...state.metadata, [field]: value },
        };
        saveState(newState);
        return newState;
      }),
    updateDivisionName: (index, value) =>
      set((state) => {
        const newState = {
          ...state,
          divisionNames: state.divisionNames.map((name, nameIndex) =>
            nameIndex === index ? value : name,
          ) as [string, string, string],
        };
        saveState(newState);
        return newState;
      }),
    setPersonCount: (count) =>
      set((state) => {
        const newState = { ...state, personCount: count };
        saveState(newState);
        return newState;
      }),
    setTransliteration: (enabled) =>
      set((state) => {
        const newState = { ...state, transliteration: enabled };
        saveState(newState);
        return newState;
      }),
    setPrintSettings: (settings) =>
      set((state) => {
        const newState = { ...state, printSettings: { ...state.printSettings, ...settings } };
        saveState(newState);
        return newState;
      }),
    updateOriginal: (rowId, field, value) =>
      set((state) => {
        const newState = {
          ...state,
          rows: state.rows.map((row) =>
            row.id === rowId
              ? { ...row, original: { ...row.original, [field]: value } }
              : row,
          ),
        };
        saveState(newState);
        return newState;
      }),
    updateDivision: (rowId, index, field, value) =>
      set((state) => {
        const newState = {
          ...state,
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
        };
        saveState(newState);
        return newState;
      }),
    updateBoundary: (rowId, index, field, value) =>
      set((state) => {
        const newState = {
          ...state,
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
        };
        saveState(newState);
        return newState;
      }),
    addRow: () =>
      set((state) => {
        const newState = { ...state, rows: [...state.rows, createRow()] };
        saveState(newState);
        return newState;
      }),
    deleteRow: (rowId) =>
      set((state) => {
        const newState = {
          ...state,
          rows: state.rows.length > 1 ? state.rows.filter((row) => row.id !== rowId) : state.rows,
        };
        saveState(newState);
        return newState;
      }),
    sortRows: (mode) =>
      set((state) => {
        const newState = { ...state, rows: sortRowsByOriginalKhesra(state.rows, mode) };
        saveState(newState);
        return newState;
      }),
    clearData: () =>
      set((state) => {
        clearStorage();
        return {
          ...defaultState,
          date: new Date().toISOString().slice(0, 10),
        };
      }),
    restoreData: () =>
      set(() => {
        const restored = restoreStateFromStorage();
        return restored || defaultState;
      }),
  };
});
