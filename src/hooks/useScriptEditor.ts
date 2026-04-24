"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MANUAL_CONTENT } from "@/constants/test-data";
import { downloadFile } from "@/lib/export";
import {
  createEmptyTest,
  createInitialTests,
  formatScript,
  generateId,
} from "@/lib/script-utils";
import { loadSavedScripts, persistScripts } from "@/lib/storage";
import type { TestCategory, TestItem, TestScript } from "@/types";

export function useScriptEditor() {
  const [project, setProject] = useState("");
  const [functionality, setFunctionality] = useState("");
  const [environment, setEnvironment] = useState("");
  const [link, setLink] = useState("");
  const [branch, setBranch] = useState("");
  const [tester, setTester] = useState("");
  const [developer, setDeveloper] = useState("");
  const [tests, setTests] = useState<TestItem[]>(createInitialTests());
  const [observations, setObservations] = useState("Sem observações");
  const [copied, setCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [savedScripts, setSavedScripts] = useState<TestScript[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    setSavedScripts(loadSavedScripts());
  }, []);

  const formatted = useMemo(
    () => formatScript({ project, functionality, environment, link, branch, tester, developer, tests, observations }),
    [project, functionality, environment, link, branch, tester, developer, observations, tests]
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [formatted]);

  const handleCopyJson = useCallback(async () => {
    const draft = { project, functionality, environment, link, branch, tester, developer, tests };
    await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 1800);
  }, [project, functionality, environment, link, branch, tester, developer, tests]);

  const addTest = (category: TestCategory) => {
    setTests((prev) => [...prev, createEmptyTest(category)]);
  };

  const updateTest = (id: string, description: string) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, description } : t)));
  };

  const removeTest = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    const script: TestScript = {
      id: generateId(),
      name: functionality || "Roteiro sem nome",
      project,
      functionality,
      environment,
      link,
      branch,
      tester,
      developer,
      tests,
      observations,
      createdAt: new Date().toLocaleString("pt-BR"),
    };
    const next = [script, ...savedScripts];
    setSavedScripts(next);
    persistScripts(next);
    setSavedNotice("Roteiro salvo localmente.");
    setTimeout(() => setSavedNotice(""), 1600);
  };

  const handleLoad = (script: TestScript) => {
    setProject(script.project ?? "");
    setFunctionality(script.functionality);
    setEnvironment(script.environment);
    setLink(script.link ?? "");
    setBranch(script.branch ?? "");
    setTester(script.tester ?? "");
    setDeveloper(script.developer ?? "");
    setTests(script.tests);
    setObservations(script.observations);
    setShowSaved(false);
  };

  const handleDelete = (id: string) => {
    const next = savedScripts.filter((s) => s.id !== id);
    setSavedScripts(next);
    persistScripts(next);
  };

  const handleNew = () => {
    setProject("");
    setFunctionality("");
    setEnvironment("");
    setLink("");
    setBranch("");
    setTester("");
    setDeveloper("");
    setTests(createInitialTests());
    setObservations("Sem observações");
  };

  const handleDownloadManual = () => {
    downloadFile(MANUAL_CONTENT, "manual-de-testes.txt");
  };

  // Expose current script snapshot for the execution flow
  const currentScriptSnapshot = { project, functionality, environment, link, branch, tester, developer, tests };

  return {
    project, setProject,
    functionality, setFunctionality,
    environment, setEnvironment,
    link, setLink,
    branch, setBranch,
    tester, setTester,
    developer, setDeveloper,
    tests,
    observations, setObservations,
    formatted,
    copied,
    jsonCopied,
    savedScripts,
    showSaved, setShowSaved,
    savedNotice,
    currentScriptSnapshot,
    addTest,
    updateTest,
    removeTest,
    handleSave,
    handleLoad,
    handleDelete,
    handleNew,
    handleCopy,
    handleCopyJson,
    handleDownloadManual,
  };
}

export type ScriptEditorHook = ReturnType<typeof useScriptEditor>;
