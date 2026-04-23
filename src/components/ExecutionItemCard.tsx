"use client";

import { RESULT_ACTIVE_STYLES, RESULT_LABELS, ITEM_ROW_BG } from "@/constants/execution";
import { cn } from "@/lib/utils";
import type { ExecutionItem, TestResult } from "@/types";

interface ExecutionItemCardProps {
  item: ExecutionItem;
  onResultChange: (id: string, result: TestResult) => void;
  onNotesChange: (id: string, notes: string) => void;
}

const RESULT_BUTTONS: TestResult[] = ["aprovado", "reprovado", "nao_aplicavel"];

export function ExecutionItemCard({ item, onResultChange, onNotesChange }: ExecutionItemCardProps) {
  return (
    <div className={cn("rounded-lg border border-l-4 p-4 transition-colors", ITEM_ROW_BG[item.result])}>
      <p className="text-sm leading-relaxed text-foreground">{item.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {RESULT_BUTTONS.map((r) => (
          <button
            key={r}
            onClick={() => onResultChange(item.id, r)}
            className={cn(
              "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
              item.result === r
                ? RESULT_ACTIVE_STYLES[r]
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {RESULT_LABELS[r]}
          </button>
        ))}
      </div>

      <input
        value={item.notes}
        onChange={(e) => onNotesChange(item.id, e.target.value)}
        placeholder="Observações (opcional)..."
        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}
