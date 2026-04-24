"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Circle,
  FileText,
  GitBranch,
  Globe,
  MinusCircle,
  XCircle,
} from "lucide-react";

import { CATEGORIES, CATEGORY_LABELS } from "@/constants/test-data";
import { cn } from "@/lib/utils";
import type { ExecutionReportPayload } from "@/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ExecutionResultsViewProps {
  report: ExecutionReportPayload;
  actions?: ReactNode;
}

const STATUS_CONFIG = {
  aprovado: {
    label: "Aprovados",
    icon: CheckCircle2,
    bg: "bg-green-50",
    border: "border-green-500",
    numColor: "text-green-700",
    labelColor: "text-green-600",
    barColor: "bg-green-500",
    badgeBg: "bg-green-100 text-green-800 border-green-400",
  },
  reprovado: {
    label: "Reprovados",
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-500",
    numColor: "text-red-700",
    labelColor: "text-red-600",
    barColor: "bg-red-500",
    badgeBg: "bg-red-100 text-red-800 border-red-400",
  },
  nao_aplicavel: {
    label: "Não aplicáveis",
    icon: MinusCircle,
    bg: "bg-slate-50",
    border: "border-slate-400",
    numColor: "text-slate-700",
    labelColor: "text-slate-500",
    barColor: "bg-slate-400",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-400",
  },
  pendente: {
    label: "Não avaliados",
    icon: Circle,
    bg: "bg-muted/60",
    border: "border-border",
    numColor: "text-foreground",
    labelColor: "text-muted-foreground",
    barColor: "bg-border",
    badgeBg: "bg-muted text-muted-foreground border-border",
  },
} as const;

const ITEM_STATUS_STYLE = {
  aprovado: "border-l-green-500 bg-green-50/60",
  reprovado: "border-l-red-500 bg-red-50/70",
  nao_aplicavel: "border-l-slate-400 bg-slate-50/70",
  pendente: "border-l-border/40 bg-background",
} as const;

const ITEM_STATUS_CHIP = {
  aprovado: "bg-green-100 text-green-800 border-green-400",
  reprovado: "bg-red-100 text-red-800 border-red-400",
  nao_aplicavel: "bg-slate-100 text-slate-700 border-slate-400",
  pendente: "bg-muted text-muted-foreground border-border",
} as const;

const RESULT_LABELS = {
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  nao_aplicavel: "Não aplicável",
  pendente: "Não avaliado",
} as const;

export function ExecutionResultsView({
  report,
  actions,
}: ExecutionResultsViewProps) {
  const executionScript = report.meta;
  const executionItems = report.items;
  const total = executionItems.length;
  const counts = {
    aprovado: executionItems.filter((i) => i.result === "aprovado").length,
    reprovado: executionItems.filter((i) => i.result === "reprovado").length,
    nao_aplicavel: executionItems.filter((i) => i.result === "nao_aplicavel").length,
    pendente: executionItems.filter((i) => i.result === "pendente").length,
  };

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const allDone = counts.pendente === 0;
  const hasReprovado = counts.reprovado > 0;

  const customItems = executionItems.filter((i) => !i.isFixed);
  const fixedItems = executionItems.filter((i) => i.isFixed);

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Relatório técnico</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {executionScript.functionality || "Execução de Testes"}
            </h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {executionScript.environment && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  {executionScript.environment}
                </span>
              )}
              {executionScript.link && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {executionScript.link}
                </span>
              )}
              {executionScript.branch && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GitBranch className="h-3.5 w-3.5" />
                  {executionScript.branch}
                </span>
              )}
              {executionScript.tester && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Tester: {executionScript.tester}
                </span>
              )}
              {executionScript.developer && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Desenvolvedor: {executionScript.developer}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Iniciado em {report.executionStartedAt}</span>
              <span>Gerado em {new Date(report.generatedAt).toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>

      {/* ── Status geral ────────────────────────────────────────────── */}
      {!allDone && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>{counts.pendente}</strong> {counts.pendente === 1 ? "item ainda não foi avaliado" : "itens ainda não foram avaliados"}.
          </span>
        </div>
      )}

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(["aprovado", "reprovado", "nao_aplicavel", "pendente"] as const).map((status) => {
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          return (
            <div
              key={status}
              className={cn(
                "rounded-xl border-2 p-4 transition-shadow",
                cfg.bg,
                cfg.border
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={cn("text-4xl font-bold leading-none", cfg.numColor)}>
                    {counts[status]}
                  </p>
                  <p className={cn("mt-1.5 text-sm font-medium", cfg.labelColor)}>
                    {cfg.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {pct(counts[status])}% do total
                  </p>
                </div>
                <Icon className={cn("h-6 w-6 opacity-70", cfg.numColor)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Barra de progresso ──────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Progresso geral</CardTitle>
            <span className="text-sm text-muted-foreground">{total} itens no total</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            {counts.aprovado > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${pct(counts.aprovado)}%` }}
                title={`Aprovados: ${counts.aprovado}`}
              />
            )}
            {counts.reprovado > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${pct(counts.reprovado)}%` }}
                title={`Reprovados: ${counts.reprovado}`}
              />
            )}
            {counts.nao_aplicavel > 0 && (
              <div
                className="bg-slate-400 transition-all"
                style={{ width: `${pct(counts.nao_aplicavel)}%` }}
                title={`Não aplicáveis: ${counts.nao_aplicavel}`}
              />
            )}
            {counts.pendente > 0 && (
              <div
                className="bg-border transition-all"
                style={{ width: `${pct(counts.pendente)}%` }}
                title={`Pendentes: ${counts.pendente}`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {(["aprovado", "reprovado", "nao_aplicavel", "pendente"] as const).map((status) => (
              <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_CONFIG[status].barColor)} />
                {STATUS_CONFIG[status].label} ({counts[status]})
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Reprovados em destaque ────────────────────────────────── */}
      {hasReprovado && (
        <Card className="border-2 border-red-400">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-base text-red-700">
                Itens reprovados ({counts.reprovado})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {executionItems
              .filter((i) => i.result === "reprovado")
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-l-4 border-red-300 border-l-red-500 bg-red-50/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                        {item.isFixed ? "Verificação Padrão" : item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground">
                        {item.description}
                      </p>
                      {item.notes && (
                        <p className="mt-2 rounded-md bg-red-100/80 px-3 py-1.5 text-xs text-red-800">
                          <span className="font-semibold">Obs:</span> {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full border border-red-400 bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                      Reprovado
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* ── Itens por categoria ──────────────────────────────────── */}
      {CATEGORIES.map((category) => {
        const items = customItems.filter((i) => i.category === category);
        if (items.length === 0) return null;

        const catAprovado = items.filter((i) => i.result === "aprovado").length;
        const catReprovado = items.filter((i) => i.result === "reprovado").length;

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {CATEGORY_LABELS[category]}
                </p>
                <div className="flex items-center gap-2">
                  {catAprovado > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {catAprovado}
                    </span>
                  )}
                  {catReprovado > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-700">
                      <XCircle className="h-3.5 w-3.5" />
                      {catReprovado}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{items.length} itens</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {items.map((item) => (
                <ResultItem key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* ── Verificações padrão ─────────────────────────────────── */}
      {fixedItems.length > 0 && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">📌</span>
                <CardTitle>Verificações Padrão</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {fixedItems.filter((i) => i.result === "aprovado").length > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {fixedItems.filter((i) => i.result === "aprovado").length}
                  </span>
                )}
                {fixedItems.filter((i) => i.result === "reprovado").length > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-700">
                    <XCircle className="h-3.5 w-3.5" />
                    {fixedItems.filter((i) => i.result === "reprovado").length}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{fixedItems.length} itens</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {fixedItems.map((item) => (
              <ResultItem key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      )}

      <Separator />

    </div>
  );
}

function ResultItem({
  item,
}: {
  item: ExecutionReportPayload["items"][number];
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 p-3.5 transition-colors",
        ITEM_STATUS_STYLE[item.result]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 text-sm leading-relaxed text-foreground">
          {item.description}
        </p>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
            ITEM_STATUS_CHIP[item.result]
          )}
        >
          {RESULT_LABELS[item.result]}
        </span>
      </div>
      {item.notes && (
        <p className="mt-2 rounded-md bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Obs:</span> {item.notes}
        </p>
      )}
    </div>
  );
}
