"use client";

import { useEffect, useState } from "react";
import { useDataRecovery } from "@/lib/useDataRecovery";
import { RotateCcw, Trash2, Download, X } from "lucide-react";

export function DataRecoveryBanner() {
  const [mounted, setMounted] = useState(false);
  const { hasRecoveryData, storageInfo, handleRestore, handleClear, handleExport } =
    useDataRecovery();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasRecoveryData || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-300 shadow-lg">
      <div className="mx-auto max-w-[1600px] px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <RotateCcw className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                Unsaved work detected!
              </p>
              <p className="text-xs text-amber-700">
                {storageInfo?.expiresIn && `Your data will expire in ${storageInfo.expiresIn}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRestore}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              <RotateCcw size={16} />
              Restore
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50"
            >
              <Download size={16} />
              Backup
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={16} />
              Discard
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-amber-600 transition-colors hover:bg-amber-100"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
