"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppNav } from "@/components/AppNav";
import { ScriptEditor } from "@/components/ScriptEditor";
import { useScriptEditor } from "@/hooks/useScriptEditor";
import { saveExecutionDraft } from "@/lib/storage";
import type { TestItem } from "@/types";

export default function CriarPage() {
  const router = useRouter();
  const editor = useScriptEditor();

  useEffect(() => {
    saveExecutionDraft(editor.currentScriptSnapshot);
  }, [editor.currentScriptSnapshot]);

  const handleInitExecution = (script: {
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tester: string;
    developer: string;
    tests: TestItem[];
  }) => {
    saveExecutionDraft(script);
    router.push("/executar");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <AppNav />
        <ScriptEditor {...editor} onInitExecution={handleInitExecution} />
      </div>
    </div>
  );
}
