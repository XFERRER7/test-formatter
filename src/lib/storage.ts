import type { TestScript } from "@/types";

const STORAGE_KEY = "test-formatter-scripts";

export function loadSavedScripts(): TestScript[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TestScript[]) : [];
  } catch {
    return [];
  }
}

export function persistScripts(scripts: TestScript[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
}
