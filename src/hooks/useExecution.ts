"use client";

import { useCallback, useState } from "react";
import { buildExecutionResultText, downloadFile } from "@/lib/export";
import { buildExecutionItems, parseScriptText } from "@/lib/script-utils";
import type { ExecutionItem, ExecutionMeta, TestItem, TestResult } from "@/types";

export function useExecution() {
  const [executionScript, setExecutionScript] = useState<ExecutionMeta | null>(null);
  const [executionItems, setExecutionItems] = useState<ExecutionItem[]>([]);
  const [executionStartedAt, setExecutionStartedAt] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [showPasteInput, setShowPasteInput] = useState(false);
  const [pasteError, setPasteError] = useState("");
  const [executionCopied, setExecutionCopied] = useState(false);

  const initExecution = (script: {
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tests: TestItem[];
  }) => {
    setExecutionScript({
      functionality: script.functionality,
      environment: script.environment,
      link: script.link ?? "",
      branch: script.branch ?? "",
    });
    setExecutionItems(buildExecutionItems(script.tests));
    setExecutionStartedAt(new Date().toLocaleString("pt-BR"));
  };

  const updateResult = (id: string, result: TestResult) => {
    setExecutionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, result } : item))
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setExecutionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleReset = () => {
    setExecutionItems((prev) =>
      prev.map((item) => ({ ...item, result: "pendente" as TestResult, notes: "" }))
    );
  };

  const getResultText = useCallback((): string => {
    if (!executionScript) return "";
    return buildExecutionResultText(executionScript, executionItems, executionStartedAt);
  }, [executionScript, executionItems, executionStartedAt]);

  const handleExport = () => {
    if (!executionScript) return;
    downloadFile(getResultText(), `execucao-${executionScript.functionality || "teste"}.txt`);
  };

  const handleCopyResult = useCallback(async () => {
    await navigator.clipboard.writeText(getResultText());
    setExecutionCopied(true);
    setTimeout(() => setExecutionCopied(false), 1800);
  }, [getResultText]);

  const handleExecuteFromPaste = () => {
    setPasteError("");
    const parsed = parseScriptText(pasteText);
    if (!parsed || parsed.items.length === 0) {
      setPasteError(
        "Não foi possível identificar itens de teste no texto. Certifique-se de colar um roteiro gerado por esta ferramenta."
      );
      return;
    }
    setExecutionScript(parsed.meta);
    setExecutionItems(parsed.items);
    setExecutionStartedAt(new Date().toLocaleString("pt-BR"));
    setPasteText("");
    setShowPasteInput(false);
  };

  const resetExecution = () => setExecutionScript(null);

  return {
    executionScript,
    executionItems,
    executionStartedAt,
    pasteText, setPasteText,
    showPasteInput, setShowPasteInput,
    pasteError, setPasteError,
    executionCopied,
    initExecution,
    updateResult,
    updateNotes,
    handleReset,
    handleExport,
    handleCopyResult,
    handleExecuteFromPaste,
    resetExecution,
  };
}

export type ExecutionHook = ReturnType<typeof useExecution>;
