import type { TestResult } from "@/types";

export const RESULT_LABELS: Record<TestResult, string> = {
  pendente: "Não avaliado",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  nao_aplicavel: "Não aplicável",
};

export const RESULT_ACTIVE_STYLES: Record<TestResult, string> = {
  pendente: "border-border bg-muted text-muted-foreground",
  aprovado: "border-green-500 bg-green-100 text-green-800 font-semibold",
  reprovado: "border-red-500 bg-red-100 text-red-800 font-semibold",
  nao_aplicavel: "border-slate-400 bg-slate-100 text-slate-700 font-semibold",
};

export const ITEM_ROW_BG: Record<TestResult, string> = {
  pendente: "border-l-border/40 bg-background",
  aprovado: "border-l-green-500 bg-green-50/60",
  reprovado: "border-l-red-500 bg-red-50/60",
  nao_aplicavel: "border-l-slate-400 bg-slate-50/70",
};
