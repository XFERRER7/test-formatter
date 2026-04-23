import type { ExecutionDraft, TestScript } from "@/types";

const STORAGE_KEY = "test-formatter-scripts";
const EXECUTION_DRAFT_KEY = "test-formatter-execution-draft";

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

export function saveExecutionDraft(draft: ExecutionDraft): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXECUTION_DRAFT_KEY, JSON.stringify(draft));
}

export function loadExecutionDraft(): ExecutionDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(EXECUTION_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as ExecutionDraft) : null;
  } catch {
    return null;
  }
}

export function clearExecutionDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(EXECUTION_DRAFT_KEY);
}
