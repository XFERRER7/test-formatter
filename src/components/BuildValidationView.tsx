"use client";

import { useState } from "react";
import {
  CheckCircle2,
  GitMerge,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import { generateId, parseDraftFromInput } from "@/lib/script-utils";
import type { ExecutionDraft, TestItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputEntry {
  id: string;
  text: string;
  parsed: ExecutionDraft | null;
  /** undefined = not yet tried; null = failed; draft = ok */
  status: "idle" | "ok" | "error";
}

interface BuildValidationViewProps {
  onMergeAndExecute: (script: ExecutionDraft) => void;
}

function mergeInputs(buildLabel: string, entries: InputEntry[]): ExecutionDraft | null {
  const valid = entries.filter((e) => e.status === "ok" && e.parsed);
  if (valid.length === 0) return null;

  // Merge metadata: first non-empty wins
  const first = valid[0].parsed!;
  const project = buildLabel.trim() || valid.map((e) => e.parsed!.project).find(Boolean) || "";
  const environment = valid.map((e) => e.parsed!.environment).find(Boolean) || first.environment;
  const tester = valid.map((e) => e.parsed!.tester).find(Boolean) || first.tester;
  const developer = valid.map((e) => e.parsed!.developer).find(Boolean) || first.developer;
  const branch = valid.map((e) => e.parsed!.branch).find(Boolean) || first.branch;
  const link = valid.map((e) => e.parsed!.link).find(Boolean) || first.link;

  // Merge tests — deduplicate by trimmed lowercase description
  const seen = new Set<string>();
  const tests: TestItem[] = [];
  for (const entry of valid) {
    for (const t of entry.parsed!.tests) {
      const key = t.description.trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        tests.push({ ...t, id: generateId() });
      }
    }
  }

  const functionalities = valid
    .map((e) => e.parsed!.functionality)
    .filter(Boolean)
    .join(" + ");

  return {
    project,
    functionality: functionalities || "Validação de Build",
    environment,
    link,
    branch,
    tester,
    developer,
    tests,
  };
}

export function BuildValidationView({ onMergeAndExecute }: BuildValidationViewProps) {
  const [buildLabel, setBuildLabel] = useState("");
  const [entries, setEntries] = useState<InputEntry[]>([
    { id: generateId(), text: "", parsed: null, status: "idle" },
  ]);

  function addEntry() {
    setEntries((prev) => [
      ...prev,
      { id: generateId(), text: "", parsed: null, status: "idle" },
    ]);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function updateEntry(id: string, text: string) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (!text.trim()) return { ...e, text, parsed: null, status: "idle" };
        const parsed = parseDraftFromInput(text);
        return {
          ...e,
          text,
          parsed,
          status: parsed ? "ok" : "error",
        };
      })
    );
  }

  const validCount = entries.filter((e) => e.status === "ok").length;
  const merged = mergeInputs(buildLabel, entries);
  const totalTests = merged?.tests.length ?? 0;

  function handleMerge() {
    if (!merged) return;
    onMergeAndExecute(merged);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur">
        <h2 className="text-xl font-semibold tracking-tight">Validação de Build</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cole múltiplos roteiros (JSON ou texto). O sistema mescla os cenários e remove duplicatas.
          Depois é só executar direto nessa tela.
        </p>
      </div>

      {/* Build label */}
      <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur">
        <div className="space-y-2">
          <Label htmlFor="build-label">Identificador da build (opcional)</Label>
          <Input
            id="build-label"
            value={buildLabel}
            onChange={(e) => setBuildLabel(e.target.value)}
            placeholder="Ex: Sprint 42 — Build v2.3.1"
            className="max-w-xl"
          />
          <p className="text-xs text-muted-foreground">
            Usado como projeto na execução. Se vazio, usa os projetos dos roteiros colados.
          </p>
        </div>
      </div>

      {/* Input entries */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <Card key={entry.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <CardTitle className="text-base">Roteiro {index + 1}</CardTitle>
                  {entry.status === "ok" && entry.parsed && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      {entry.parsed.functionality || "Sem nome"} ·{" "}
                      {entry.parsed.tests.filter((t) => t.description.trim()).length} cenários
                    </span>
                  )}
                  {entry.status === "error" && (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      <XCircle className="h-3 w-3" />
                      Formato inválido
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEntry(entry.id)}
                  disabled={entries.length === 1}
                  aria-label="Remover roteiro"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <CardDescription>
                Cole o JSON ou o texto copiado do roteiro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                rows={6}
                placeholder={`Cole aqui o JSON ou texto do roteiro:\n\n🛠️ Roteiro de Teste\nFuncionalidade: ...\n\nou\n\n{"functionality":"...","tests":[...]}`}
                value={entry.text}
                onChange={(e) => updateEntry(entry.id, e.target.value)}
              />
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addEntry} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Adicionar outro roteiro
        </Button>
      </div>

      {/* Merge summary + CTA */}
      {validCount > 0 && merged && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-primary">
                {validCount} {validCount === 1 ? "roteiro válido" : "roteiros válidos"} encontrado{validCount === 1 ? "" : "s"}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {totalTests} cenários únicos após mesclar e remover duplicatas.
              </p>
              {merged.functionality && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Funcionalidades: <span className="font-medium text-foreground">{merged.functionality}</span>
                </p>
              )}
            </div>
            <Button
              onClick={handleMerge}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <GitMerge className="h-4 w-4" />
              Mesclar e executar
            </Button>
          </div>
        </div>
      )}

      {validCount === 0 && entries.some((e) => e.text.trim()) && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          Nenhum roteiro válido encontrado. Verifique o conteúdo colado.
        </div>
      )}
    </div>
  );
}
