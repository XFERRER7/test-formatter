"use client";

import { ClipboardList, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveView } from "@/types";

interface AppNavProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

export function AppNav({ activeView, onViewChange }: AppNavProps) {
  return (
    <nav className="mb-6 flex gap-1.5 rounded-2xl border border-border bg-card/90 p-1.5 shadow-sm backdrop-blur">
      <button
        onClick={() => onViewChange("criar")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
          activeView === "criar"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <FileEdit className="h-4 w-4" />
        Criar Roteiro
      </button>
      <button
        onClick={() => onViewChange("executar")}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
          activeView === "executar"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <ClipboardList className="h-4 w-4" />
        Executar Testes
      </button>
    </nav>
  );
}
