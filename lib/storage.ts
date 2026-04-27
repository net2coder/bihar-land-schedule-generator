/**
 * Cookie/LocalStorage Utilities for Bantwara Schedule Generator
 * Prevents data loss on accidental page refresh
 */

const STORAGE_KEY = "bantwara_schedule_state";
const STORAGE_EXPIRY_DAYS = 30; // Store for 30 days

/**
 * Save state to localStorage with optional expiry
 */
export function saveStateToStorage(state: any): void {
  try {
    const payload = {
      data: state,
      timestamp: Date.now(),
      expiryDate: new Date(Date.now() + STORAGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to save state to storage:", error);
  }
}

/**
 * Restore state from localStorage
 */
export function restoreStateFromStorage(): any | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const payload = JSON.parse(stored);
    const now = new Date();
    const expiryDate = new Date(payload.expiryDate);

    // Check if data has expired
    if (now > expiryDate) {
      clearStorage();
      return null;
    }

    return payload.data;
  } catch (error) {
    console.warn("Failed to restore state from storage:", error);
    return null;
  }
}

/**
 * Clear stored state
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear storage:", error);
  }
}

/**
 * Get storage info (for debugging)
 */
export function getStorageInfo(): { exists: boolean; size: number; expiresIn: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const payload = JSON.parse(stored);
    const expiryDate = new Date(payload.expiryDate);
    const now = new Date();
    const hoursRemaining = Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    return {
      exists: true,
      size: new Blob([stored]).size,
      expiresIn: hoursRemaining > 0 ? `${hoursRemaining} hours` : "Expired",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Export state as JSON file (for manual backup)
 */
export function exportStateAsFile(state: any, filename = "bantwara_schedule.json"): void {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export state:", error);
  }
}

/**
 * Import state from JSON file
 */
export async function importStateFromFile(file: File): Promise<any | null> {
  try {
    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to import state:", error);
    return null;
  }
}

/**
 * Check if browser supports localStorage
 */
export function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
