"use client";

import { useCallback, useState } from "react";
import { ClipboardCopy, Eraser, FileJson, Sparkles } from "lucide-react";

import { AppNav } from "@/components/AppNav";
import { ExecutionResultsView } from "@/components/ExecutionResultsView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { buildExecutionResultText } from "@/lib/export";
import { parseExecutionReportJson } from "@/lib/result-json";
import type { ExecutionReportPayload } from "@/types";

export default function ResultadosPage() {
  const [jsonText, setJsonText] = useState("");
  const [report, setReport] = useState<ExecutionReportPayload | null>(null);
  const [importError, setImportError] = useState("");
  const [summaryCopied, setSummaryCopied] = useState(false);

  const handleImport = () => {
    const parsed = parseExecutionReportJson(jsonText);
    if (!parsed.data) {
      setImportError(parsed.error ?? "Não foi possível importar o relatório.");
      setReport(null);
      return;
    }

    setImportError("");
    setReport(parsed.data);
  };

  const handleCopySummary = useCallback(async () => {
    if (!report) return;
    await navigator.clipboard.writeText(
      buildExecutionResultText(report.meta, report.items, report.executionStartedAt)
    );
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 1800);
  }, [report]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <AppNav />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Leitura técnica de resultados</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Importar relatório JSON</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Esta tela é para o programador. Cole aqui o JSON exportado pela execução para abrir o relatório visual com cards, resumo e itens agrupados.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Colar JSON</CardTitle>
                <CardDescription>
                  Use o JSON gerado na tela de execução. O formato é validado antes da visualização.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={jsonText}
                  onChange={(event) => {
                    setJsonText(event.target.value);
                    setImportError("");
                  }}
                  placeholder="Cole aqui o JSON do relatório..."
                  rows={16}
                  className="font-mono text-xs"
                />
                {importError ? (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {importError}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleImport} disabled={!jsonText.trim()}>
                    <FileJson className="h-4 w-4" />
                    Visualizar relatório
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setJsonText("");
                      setImportError("");
                      setReport(null);
                    }}
                  >
                    <Eraser className="h-4 w-4" />
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Como usar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>1. O QA executa os testes na página Executar.</p>
                <p>2. Ao final, ele copia o JSON do relatório.</p>
                <p>3. O programador cola esse JSON aqui para analisar o resultado visualmente.</p>
              </CardContent>
            </Card>
          </div>

          <div>
            {report ? (
              <ExecutionResultsView
                report={report}
                actions={
                  <>
                    <Button size="sm" onClick={handleCopySummary}>
                      <ClipboardCopy className="h-4 w-4" />
                      {summaryCopied ? "Resumo copiado!" : "Copiar resumo"}
                    </Button>
                  </>
                }
              />
            ) : (
              <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center shadow-sm">
                <div>
                  <FileJson className="mx-auto h-10 w-10 text-primary/70" />
                  <h2 className="mt-4 text-lg font-semibold">Aguardando um JSON de resultado</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Assim que um relatório válido for colado, esta área mostrará os cards de resumo, progresso, itens reprovados e agrupamentos por categoria.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
