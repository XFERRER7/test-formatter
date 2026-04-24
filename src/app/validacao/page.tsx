"use client";

import { useState } from "react";

import { AppNav } from "@/components/AppNav";
import { BuildValidationView } from "@/components/BuildValidationView";
import { ExecutionBoard } from "@/components/ExecutionBoard";
import { useExecution } from "@/hooks/useExecution";
import type { ExecutionDraft } from "@/types";

export default function ValidacaoPage() {
  const execution = useExecution();
  const [started, setStarted] = useState(false);

  function handleMergeAndExecute(script: ExecutionDraft) {
    execution.initExecution(script);
    setStarted(true);
  }

  function handleReset() {
    execution.resetExecution();
    setStarted(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <AppNav />

        {!started ? (
          <BuildValidationView onMergeAndExecute={handleMergeAndExecute} />
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
            resetExecution={handleReset}
          />
        )}
      </div>
    </div>
  );
}
