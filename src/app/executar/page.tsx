"use client";

import { useEffect, useState } from "react";

import { AppNav } from "@/components/AppNav";
import { ExecutionBoard } from "@/components/ExecutionBoard";
import { ExecutionSelectView } from "@/components/ExecutionSelectView";
import { useExecution } from "@/hooks/useExecution";
import { loadExecutionDraft, loadSavedScripts, saveExecutionDraft } from "@/lib/storage";
import type { ExecutionDraft, TestScript } from "@/types";

export default function ExecutarPage() {
  const execution = useExecution();
  const [savedScripts, setSavedScripts] = useState<TestScript[]>([]);
  const [currentScript, setCurrentScript] = useState<ExecutionDraft | null>(null);

  useEffect(() => {
    setSavedScripts(loadSavedScripts());
    setCurrentScript(loadExecutionDraft());
  }, []);

  const handleInitExecution = (script: ExecutionDraft) => {
    saveExecutionDraft(script);
    setCurrentScript(script);
    execution.initExecution(script);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <AppNav />

        {execution.executionScript === null ? (
          <ExecutionSelectView
            savedScripts={savedScripts}
            currentScript={currentScript}
            onInitExecution={handleInitExecution}
          />
        ) : (
          <ExecutionBoard
            executionScript={execution.executionScript}
            executionItems={execution.executionItems}
            executionStartedAt={execution.executionStartedAt}
            updateResult={execution.updateResult}
            updateNotes={execution.updateNotes}
            handleCopyResult={execution.handleCopyResult}
            handleCopyJson={execution.handleCopyJson}
            executionCopied={execution.executionCopied}
            jsonCopied={execution.jsonCopied}
            resetExecution={execution.resetExecution}
          />
        )}
      </div>
    </div>
  );
}
