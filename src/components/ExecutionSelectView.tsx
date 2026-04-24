"use client";

import { useState } from "react";
import { ClipboardPaste, Play } from "lucide-react";

import { FIXED_CHECKS } from "@/constants/test-data";
import type { ExecutionDraft, TestItem, TestScript } from "@/types";

import { parseDraftFromInput } from "@/lib/script-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ExecutionSelectViewProps {
  savedScripts: TestScript[];
  currentScript: ExecutionDraft | null;
  onInitExecution: (script: {
    project: string;
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tester: string;
    developer: string;
    tests: TestItem[];
  }) => void;
}

function parseInput(text: string): ExecutionDraft | null {
  return parseDraftFromInput(text);
}

export function ExecutionSelectView({
  savedScripts,
  currentScript,
  onInitExecution,
}: ExecutionSelectViewProps) {
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");

  const hasDraft =
    currentScript !== null &&
    (Boolean(currentScript.functionality.trim()) ||
      Boolean(currentScript.environment.trim()) ||
      currentScript.tests.some((test) => test.description.trim()));

  function handleImportJson() {
    const draft = parseInput(jsonInput);
    if (!draft) {
      setJsonError("Formato inválido. Cole um JSON ou o texto copiado do roteiro.");
      return;
    }
    setJsonError("");
    setJsonInput("");
    setShowJsonInput(false);
    onInitExecution(draft);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur">
        <h2 className="text-xl font-semibold tracking-tight">Executar Testes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha um roteiro salvo, use o rascunho atual ou importe um roteiro via JSON.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hasDraft && currentScript ? (
          <Card
            className="cursor-pointer border-dashed transition-colors hover:border-primary hover:bg-muted/40"
            onClick={() => onInitExecution(currentScript)}
          >
            <CardHeader>
              <CardTitle className="text-base">
                {currentScript.functionality || "Roteiro em rascunho"}
              </CardTitle>
              <CardDescription>
                {currentScript.environment
                  ? `Ambiente: ${currentScript.environment}`
                  : "Vindo da tela de criação"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Play className="h-4 w-4" />
                <span>Usar roteiro em rascunho</span>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {savedScripts.map((script) => (
          <Card
            key={script.id}
            className="cursor-pointer transition-colors hover:border-primary hover:bg-muted/40"
            onClick={() => onInitExecution(script)}
          >
            <CardHeader>
              <CardTitle className="text-base">{script.name}</CardTitle>
              <CardDescription>{script.environment}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{script.createdAt}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {script.tests.filter((t) => t.description.trim()).length} cenários +{" "}
                {FIXED_CHECKS.length} verificações padrão
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* JSON import section */}
      <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Importar roteiro (JSON ou texto)</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Cole o JSON ou o texto copiado de um roteiro para iniciar a execução.
            </p>
          </div>
          <button
            onClick={() => {
              setShowJsonInput((v) => !v);
              setJsonError("");
              setJsonInput("");
            }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/70"
          >
            <ClipboardPaste className="h-4 w-4" />
            {showJsonInput ? "Cancelar" : "Colar roteiro"}
          </button>
        </div>

        {showJsonInput && (
          <div className="mt-4 space-y-3">
            <textarea
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              rows={8}
              placeholder={`Cole aqui o JSON ou o texto do roteiro:\n\n🛠️ Roteiro de Teste\nFuncionalidade: ...\n\nou\n\n{"functionality":"...","tests":[...]}`}
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError("");
              }}
            />
            {jsonError && (
              <p className="text-sm text-destructive">{jsonError}</p>
            )}
            <button
              onClick={handleImportJson}
              disabled={!jsonInput.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              Iniciar execução
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
