"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  ClipboardCopy,
  ClipboardList,
  FileJson,
  FileText,
  Lock,
  MinusCircle,
  XCircle,
} from "lucide-react";

import { CATEGORIES, CATEGORY_LABELS } from "@/constants/test-data";
import type { ExecutionHook } from "@/hooks/useExecution";
import { printExecutionReport } from "@/lib/print-report";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExecutionItemCard } from "@/components/ExecutionItemCard";

interface ExecutionBoardProps
  extends Pick<
    ExecutionHook,
    | "executionScript"
    | "executionItems"
    | "executionStartedAt"
    | "updateResult"
    | "updateNotes"
    | "handleCopyResult"
    | "handleCopyJson"
    | "executionCopied"
    | "jsonCopied"
    | "resetExecution"
  > {}

export function ExecutionBoard({
  executionScript,
  executionItems,
  executionStartedAt,
  updateResult,
  updateNotes,
  handleCopyResult,
  handleCopyJson,
  executionCopied,
  jsonCopied,
  resetExecution,
}: ExecutionBoardProps) {
  const [finalized, setFinalized] = useState(false);

  if (!executionScript) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-xl">
                {executionScript.functionality || "Execução de Testes"}
              </CardTitle>
              <CardDescription className="mt-1 flex flex-wrap gap-x-4">
                {executionScript.project && (
                  <span>Projeto: {executionScript.project}</span>
                )}
                {executionScript.environment && (
                  <span>Ambiente: {executionScript.environment}</span>
                )}
                {executionScript.link && (
                  <span>Link: {executionScript.link}</span>
                )}
                {executionScript.branch && (
                  <span>Branch: {executionScript.branch}</span>
                )}
                {executionScript.tester && (
                  <span>Tester: {executionScript.tester}</span>
                )}
                {executionScript.developer && (
                  <span>Desenvolvedor: {executionScript.developer}</span>
                )}
              </CardDescription>
              {executionStartedAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Iniciado em {executionStartedAt}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">{executionItems.filter((i) => i.result === "pendente").length}</span>
                  <span className="text-muted-foreground">não avaliados</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-green-500 bg-green-50 px-3 py-1.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-800">{executionItems.filter((i) => i.result === "aprovado").length}</span>
                  <span className="text-green-700">aprovados</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-red-500 bg-red-50 px-3 py-1.5 text-sm">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-bold text-red-800">{executionItems.filter((i) => i.result === "reprovado").length}</span>
                  <span className="text-red-700">reprovados</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-400 bg-slate-50 px-3 py-1.5 text-sm">
                  <MinusCircle className="h-4 w-4 text-slate-500" />
                  <span className="font-bold text-slate-700">{executionItems.filter((i) => i.result === "nao_aplicavel").length}</span>
                  <span className="text-slate-600">não aplicáveis</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyResult} disabled={finalized}>
                <ClipboardCopy className="h-4 w-4" />
                {executionCopied ? "Texto copiado!" : "Copiar texto"}
              </Button>
              <Button size="sm" onClick={handleCopyJson} disabled={finalized}>
                <FileJson className="h-4 w-4" />
                {jsonCopied ? "JSON copiado!" : "Copiar JSON"}
              </Button>
              <Button variant="outline" size="sm" onClick={resetExecution} disabled={finalized}>
                <ClipboardList className="h-4 w-4" />
                Trocar roteiro
              </Button>
              {!finalized ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50"
                  onClick={() => setFinalized(true)}
                >
                  <Lock className="h-4 w-4" />
                  Finalizar teste
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    printExecutionReport(executionScript, executionItems, executionStartedAt ?? "")
                  }
                >
                  <FileText className="h-4 w-4" />
                  Exportar PDF
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {finalized && (
        <div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-5 py-3 text-sm text-green-800">
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            <strong>Execução finalizada.</strong> Os resultados estão bloqueados para edição. Clique em{" "}
            <strong>Exportar PDF</strong> para salvar o relatório.
          </span>
        </div>
      )}

      {CATEGORIES.map((category) => {
        const items = executionItems.filter(
          (i) => !i.isFixed && i.category === category
        );
        if (items.length === 0) return null;
        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {CATEGORY_LABELS[category]}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <ExecutionItemCard
                  key={item.id}
                  item={item}
                  onResultChange={finalized ? () => {} : updateResult}
                  onNotesChange={finalized ? () => {} : updateNotes}
                />
              ))}
            </CardContent>
          </Card>
        );
      })}

      {executionItems.some((i) => i.isFixed) && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">📌</span>
              <CardTitle>Verificações Padrão</CardTitle>
            </div>
            <CardDescription>
              Itens obrigatórios comuns a todas as tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {executionItems
              .filter((i) => i.isFixed)
              .map((item) => (
                <ExecutionItemCard
                  key={item.id}
                  item={item}
                  onResultChange={finalized ? () => {} : updateResult}
                  onNotesChange={finalized ? () => {} : updateNotes}
                />
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
