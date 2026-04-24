"use client";

import { useCallback, useState } from "react";
import { buildExecutionResultText } from "@/lib/export";
import { buildExecutionReportJson, buildExecutionReportPayload } from "@/lib/result-json";
import { buildExecutionItems } from "@/lib/script-utils";
import type { ExecutionItem, ExecutionMeta, TestItem, TestResult } from "@/types";

export function useExecution() {
  const [executionScript, setExecutionScript] = useState<ExecutionMeta | null>(null);
  const [executionItems, setExecutionItems] = useState<ExecutionItem[]>([]);
  const [executionStartedAt, setExecutionStartedAt] = useState("");
  const [executionCopied, setExecutionCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const initExecution = (script: {
    project: string;
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tester: string;
    developer: string;
    tests: TestItem[];
  }) => {
    setExecutionScript({
      project: script.project ?? "",
      functionality: script.functionality,
      environment: script.environment,
      link: script.link ?? "",
      branch: script.branch ?? "",
      tester: script.tester ?? "",
      developer: script.developer ?? "",
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

  const getReportPayload = useCallback(() => {
    if (!executionScript) return null;
    return buildExecutionReportPayload(
      executionScript,
      executionItems,
      executionStartedAt
    );
  }, [executionScript, executionItems, executionStartedAt]);

  const handleCopyResult = useCallback(async () => {
    await navigator.clipboard.writeText(getResultText());
    setExecutionCopied(true);
    setTimeout(() => setExecutionCopied(false), 1800);
  }, [getResultText]);

  const handleCopyJson = useCallback(async () => {
    if (!executionScript) return;
    await navigator.clipboard.writeText(
      buildExecutionReportJson(executionScript, executionItems, executionStartedAt)
    );
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 1800);
  }, [executionItems, executionScript, executionStartedAt]);

  const resetExecution = () => setExecutionScript(null);

  return {
    executionScript,
    executionItems,
    executionStartedAt,
    executionCopied,
    jsonCopied,
    initExecution,
    updateResult,
    updateNotes,
    handleReset,
    handleCopyResult,
    handleCopyJson,
    resetExecution,
    getReportPayload,
  };
}

export type ExecutionHook = ReturnType<typeof useExecution>;
