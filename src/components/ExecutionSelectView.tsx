"use client";

import { ClipboardPaste, Play, XCircle } from "lucide-react";

import { FIXED_CHECKS } from "@/constants/test-data";
import type { ExecutionHook } from "@/hooks/useExecution";
import type { TestItem, TestScript } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ExecutionSelectViewProps
  extends Pick<
    ExecutionHook,
    | "pasteText"
    | "setPasteText"
    | "showPasteInput"
    | "setShowPasteInput"
    | "pasteError"
    | "setPasteError"
    | "handleExecuteFromPaste"
  > {
  savedScripts: TestScript[];
  currentScript: {
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tests: TestItem[];
  };
  onInitExecution: (script: {
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tests: TestItem[];
  }) => void;
}

export function ExecutionSelectView({
  savedScripts,
  currentScript,
  onInitExecution,
  pasteText, setPasteText,
  showPasteInput, setShowPasteInput,
  pasteError, setPasteError,
  handleExecuteFromPaste,
}: ExecutionSelectViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur">
        <h2 className="text-xl font-semibold tracking-tight">Executar Testes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione um roteiro salvo ou execute o roteiro atual do formulário.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          className="cursor-pointer border-dashed transition-colors hover:border-primary hover:bg-muted/40"
          onClick={() => onInitExecution(currentScript)}
        >
          <CardHeader>
            <CardTitle className="text-base">
              {currentScript.functionality || "Roteiro atual"}
            </CardTitle>
            <CardDescription>
              {currentScript.environment
                ? `Ambiente: ${currentScript.environment}`
                : "Do formulário atual"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Play className="h-4 w-4" />
              <span>Usar roteiro do formulário</span>
            </div>
          </CardContent>
        </Card>

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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Colar roteiro</CardTitle>
              <CardDescription>
                Cole o texto de um roteiro gerado por esta ferramenta para iniciar a execução.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowPasteInput((p) => !p);
                setPasteError("");
              }}
            >
              <ClipboardPaste className="h-4 w-4" />
              {showPasteInput ? "Cancelar" : "Colar texto"}
            </Button>
          </div>
        </CardHeader>
        {showPasteInput && (
          <CardContent className="space-y-3">
            <Textarea
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                setPasteError("");
              }}
              placeholder="Cole aqui o texto do roteiro gerado..."
              rows={10}
              className="font-mono text-xs"
            />
            {pasteError && (
              <p className="flex items-center gap-1.5 text-xs text-red-600">
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                {pasteError}
              </p>
            )}
            <Button
              onClick={handleExecuteFromPaste}
              disabled={!pasteText.trim()}
              className="w-full"
            >
              <Play className="h-4 w-4" />
              Iniciar execução
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
