"use client";

import { useState } from "react";

import { useScriptEditor } from "@/hooks/useScriptEditor";
import { useExecution } from "@/hooks/useExecution";
import { AppNav } from "@/components/AppNav";
import { ScriptEditor } from "@/components/ScriptEditor";
import { ExecutionSelectView } from "@/components/ExecutionSelectView";
import { ExecutionBoard } from "@/components/ExecutionBoard";
import type { ActiveView, TestItem } from "@/types";

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("criar");
  const editor = useScriptEditor();
  const execution = useExecution();

  const handleInitExecution = (script: {
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tests: TestItem[];
  }) => {
    execution.initExecution(script);
    setActiveView("executar");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <AppNav activeView={activeView} onViewChange={setActiveView} />

        {activeView === "criar" ? (
          <ScriptEditor {...editor} onInitExecution={handleInitExecution} />
        ) : execution.executionScript === null ? (
          <ExecutionSelectView
            savedScripts={editor.savedScripts}
            currentScript={editor.currentScriptSnapshot}
            onInitExecution={handleInitExecution}
            pasteText={execution.pasteText}
            setPasteText={execution.setPasteText}
            showPasteInput={execution.showPasteInput}
            setShowPasteInput={execution.setShowPasteInput}
            pasteError={execution.pasteError}
            setPasteError={execution.setPasteError}
            handleExecuteFromPaste={execution.handleExecuteFromPaste}
          />
        ) : (
          <ExecutionBoard
            executionScript={execution.executionScript}
            executionItems={execution.executionItems}
            executionStartedAt={execution.executionStartedAt}
            updateResult={execution.updateResult}
            updateNotes={execution.updateNotes}
            handleReset={execution.handleReset}
            handleExport={execution.handleExport}
            handleCopyResult={execution.handleCopyResult}
            executionCopied={execution.executionCopied}
            resetExecution={execution.resetExecution}
          />
        )}
      </div>
    </div>
  );
}
