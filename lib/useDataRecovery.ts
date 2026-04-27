/**
 * React hook for Bantwara data storage and recovery
 */

"use client";

import { useEffect, useState } from "react";
import { useScheduleStore } from "@/lib/store";
import { getStorageInfo, isStorageAvailable, exportStateAsFile, importStateFromFile } from "@/lib/storage";

export interface StorageInfo {
  exists: boolean;
  size: number;
  expiresIn: string;
}

export function useDataRecovery() {
  const [hasRecoveryData, setHasRecoveryData] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const restoreData = useScheduleStore((state) => state.restoreData);
  const clearData = useScheduleStore((state) => state.clearData);

  useEffect(() => {
    // Check if storage is available and has data
    if (isStorageAvailable()) {
      const info = getStorageInfo();
      setStorageInfo(info);
      setHasRecoveryData(info !== null);
    }
  }, []);

  const handleRestore = () => {
    restoreData();
    setHasRecoveryData(false);
  };

  const handleClear = () => {
    clearData();
    setHasRecoveryData(false);
  };

  const handleExport = () => {
    const state = useScheduleStore.getState();
    const filename = `bantwara_schedule_${new Date().toISOString().slice(0, 10)}.json`;
    exportStateAsFile(
      {
        rows: state.rows,
        metadata: state.metadata,
        divisionNames: state.divisionNames,
        personCount: state.personCount,
        transliteration: state.transliteration,
        printSettings: state.printSettings,
      },
      filename,
    );
  };

  const handleImport = async (file: File) => {
    const data = await importStateFromFile(file);
    if (data) {
      // You would need to add an importData method to the store for this
      console.log("Imported data:", data);
    }
  };

  return {
    hasRecoveryData,
    storageInfo,
    handleRestore,
    handleClear,
    handleExport,
    handleImport,
  };
}

/**
 * Hook to check for unsaved changes
 */
export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return { hasUnsavedChanges, setHasUnsavedChanges };
}
