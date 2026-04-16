"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardCopy,
  Download,
  FilePlus2,
  FolderOpen,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type TestCategory =
  | "caminho_feliz"
  | "validacao"
  | "regra_negocio"
  | "impacto_indireto";

interface TestItem {
  id: string;
  category: TestCategory;
  description: string;
}

interface TestScript {
  id: string;
  name: string;
  functionality: string;
  environment: string;
  link: string;
  branch: string;
  tests: TestItem[];
  observations: string;
  createdAt: string;
}

const CATEGORIES: TestCategory[] = [
  "caminho_feliz",
  "validacao",
  "regra_negocio",
  "impacto_indireto",
];

const CATEGORY_LABELS: Record<TestCategory, string> = {
  caminho_feliz: "Caminho Feliz",
  validacao: "Validação",
  regra_negocio: "Regra de Negócio",
  impacto_indireto: "Impacto Indireto",
};

const CATEGORY_PLACEHOLDERS: Record<TestCategory, string> = {
  caminho_feliz:
    "Ex: Realizar um cadastro completo e verificar se salvou no banco",
  validacao: "Ex: Tentar salvar sem o campo CPF e ver se o erro aparece",
  regra_negocio:
    "Ex: Verificar se o nome do usuário é exibido corretamente em letras maiúsculas, conforme a regra de negócio",
  impacto_indireto:
    "Ex: Abrir a listagem e ver se o novo item aparece lá",
};

const FIXED_CHECKS: { title: string; description: string }[] = [
  {
    title: "Ortografia",
    description:
      "Existem erros de portugu\u00eas nos r\u00f3tulos, bot\u00f5es ou mensagens de alerta?",
  },
  {
    title: "Campos Obrigat\u00f3rios",
    description:
      "Se eu deixar um campo obrigat\u00f3rio vazio e tentar salvar, o sistema barra ou d\u00e1 erro de c\u00f3digo (500)?",
  },
  {
    title: "Tipagem de Campos",
    description:
      "Tentar inserir letras em campos de n\u00famero (ex: valor, telefone) ou s\u00edmbolos em campos de nome.",
  },
  {
    title: "Limites de Caracteres",
    description:
      "Tentar colar um texto gigante em um campo pequeno para ver se o layout \"explode\" ou se o banco corta o texto.",
  },
  {
    title: "Funcionamento ao redor",
    description:
      "A altera\u00e7\u00e3o afetou algo que j\u00e1 estava funcionando ao redor? Testar as funcionalidades relacionadas para garantir que n\u00e3o houve regress\u00e3o.",
  },
  {
    title: "Responsividade",
    description:
      "Testar a interface em diferentes tamanhos de tela para garantir que os elementos se ajustem corretamente.",
  },
];

const STORAGE_KEY = "test-formatter-scripts";

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

function createEmptyTest(category: TestCategory): TestItem {
  return { id: generateId(), category, description: "" };
}

function createInitialTests(): TestItem[] {
  return CATEGORIES.map((category) => createEmptyTest(category));
}

function formatScript(script: {
  functionality: string;
  environment: string;
  link: string;
  branch: string;
  tests: TestItem[];
  observations: string;
}): string {
  const lines: string[] = [];
  lines.push("🛠️ Roteiro de Teste");
  lines.push(`Funcionalidade: ${script.functionality}`);
  lines.push(`Ambiente: ${script.environment}`);
  if (script.link) lines.push(`Link: ${script.link}`);
  if (script.branch) lines.push(`Branch: ${script.branch}`);
  lines.push("");
  lines.push("📋 O que testar (Checklist):");

  for (const category of CATEGORIES) {
    const items = script.tests.filter((test) => test.category === category);
    for (const item of items) {
      lines.push(`[ ] ${CATEGORY_LABELS[category]}: ${item.description}`);
      lines.push("");
    }
  }

  lines.push("⚠️ Observações Técnicas:");
  lines.push(script.observations);
  lines.push("");
  lines.push("📌 Verificações Padrão:");
  for (const check of FIXED_CHECKS) {
    lines.push(`[ ] ${check.title}: ${check.description}`);
    lines.push("");
  }

  return lines.join("\n");
}

function loadSavedScripts(): TestScript[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveScripts(scripts: TestScript[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
}

export default function Home() {
  const [functionality, setFunctionality] = useState("");
  const [environment, setEnvironment] = useState("");
  const [link, setLink] = useState("");
  const [branch, setBranch] = useState("");
  const [tests, setTests] = useState<TestItem[]>(createInitialTests());
  const [observations, setObservations] = useState("Sem observações");
  const [copied, setCopied] = useState(false);
  const [savedScripts, setSavedScripts] = useState<TestScript[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    setSavedScripts(loadSavedScripts());
  }, []);

  const formatted = useMemo(
    () => formatScript({ functionality, environment, link, branch, tests, observations }),
    [functionality, environment, link, branch, observations, tests]
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [formatted]);

  const addTest = (category: TestCategory) => {
    setTests((previous) => [...previous, createEmptyTest(category)]);
  };

  const updateTest = (id: string, description: string) => {
    setTests((previous) =>
      previous.map((test) =>
        test.id === id ? { ...test, description } : test
      )
    );
  };

  const removeTest = (id: string) => {
    setTests((previous) => previous.filter((test) => test.id !== id));
  };

  const handleSave = () => {
    const script: TestScript = {
      id: generateId(),
      name: functionality || "Roteiro sem nome",
      functionality,
      environment,
      link,
      branch,
      tests,
      observations,
      createdAt: new Date().toLocaleString("pt-BR"),
    };

    const nextScripts = [script, ...savedScripts];
    setSavedScripts(nextScripts);
    saveScripts(nextScripts);
    setSavedNotice("Roteiro salvo localmente.");
    setTimeout(() => setSavedNotice(""), 1600);
  };

  const handleLoadScript = (script: TestScript) => {
    setFunctionality(script.functionality);
    setEnvironment(script.environment);
    setLink(script.link ?? "");
    setBranch(script.branch ?? "");
    setTests(script.tests);
    setObservations(script.observations);
    setShowSaved(false);
  };

  const handleDeleteScript = (id: string) => {
    const nextScripts = savedScripts.filter((script) => script.id !== id);
    setSavedScripts(nextScripts);
    saveScripts(nextScripts);
  };

  const handleNew = () => {
    setFunctionality("");
    setEnvironment("");
    setLink("");
    setBranch("");
    setTests(createInitialTests());
    setObservations("Sem observações");
  };

  const handleExportTxt = () => {
    const blob = new Blob([formatted], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roteiro-${functionality || "teste"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <header className="mb-6 rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Test Formatter
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight">
                Gerador de Roteiro de Teste
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Preencha os campos, monte seu checklist e copie o roteiro formatado.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleNew}>
                <FilePlus2 className="h-4 w-4" />
                Novo
              </Button>
              <Button variant="outline" onClick={() => setShowSaved((state) => !state)}>
                <FolderOpen className="h-4 w-4" />
                Salvos ({savedScripts.length})
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>

          {savedNotice && (
            <p className="mt-3 text-sm text-muted-foreground">{savedNotice}</p>
          )}
        </header>

        {showSaved && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Roteiros salvos no navegador</CardTitle>
              <CardDescription>
                Clique em um roteiro para carregar os dados no formulário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedScripts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum roteiro salvo até o momento.
                </p>
              ) : (
                <div className="space-y-2">
                  {savedScripts.map((script) => (
                    <div
                      key={script.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                    >
                      <button
                        onClick={() => handleLoadScript(script)}
                        className="flex-1 text-left"
                      >
                        <p className="truncate text-sm font-medium">{script.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {script.createdAt}
                        </p>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteScript(script.id)}
                        aria-label="Excluir roteiro"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <main className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações básicas</CardTitle>
                <CardDescription>
                  Dados principais da funcionalidade que será validada.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="functionality">Funcionalidade</Label>
                  <Input
                    id="functionality"
                    value={functionality}
                    onChange={(event) => setFunctionality(event.target.value)}
                    placeholder="Nome da tela ou recurso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Ambiente</Label>
                  <Input
                    id="environment"
                    value={environment}
                    onChange={(event) => setEnvironment(event.target.value)}
                    placeholder="Ex: Homologação, Produção..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={branch}
                    onChange={(event) => setBranch(event.target.value)}
                    placeholder="Ex: feature/minha-branch"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checklist de testes</CardTitle>
                <CardDescription>
                  Adicione, edite e remova cenários por categoria.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {CATEGORIES.map((category, index) => {
                  const currentTests = tests.filter(
                    (test) => test.category === category
                  );

                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="secondary">{CATEGORY_LABELS[category]}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addTest(category)}
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar item
                        </Button>
                      </div>

                      {currentTests.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Nenhum teste nessa categoria.
                        </p>
                      )}

                      <div className="space-y-2">
                        {currentTests.map((test) => (
                          <div key={test.id} className="flex gap-2">
                            <Input
                              value={test.description}
                              onChange={(event) =>
                                updateTest(test.id, event.target.value)
                              }
                              placeholder={CATEGORY_PLACEHOLDERS[category]}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTest(test.id)}
                              aria-label="Remover item"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {index < CATEGORIES.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observações técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={observations}
                  onChange={(event) => setObservations(event.target.value)}
                  placeholder="Adicione observações técnicas relevantes..."
                  rows={4}
                />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-primary bg-secondary/60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📌</span>
                  <CardTitle>Verificações padrão</CardTitle>
                </div>
                <CardDescription>
                  Estas verificações são comuns a todas as tasks e já estarão no texto gerado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {FIXED_CHECKS.map((check) => (
                    <li key={check.title} className="flex gap-2 text-sm">
                      <span className="mt-0.5 shrink-0 text-muted-foreground">[ ]</span>
                      <span>
                        <span className="font-medium">{check.title}:</span>{" "}
                        <span className="text-muted-foreground">{check.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>Pré-visualização</CardTitle>
                    <CardDescription>
                      O texto abaixo já está pronto para copiar e compartilhar.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportTxt}>
                      <Download className="h-4 w-4" />
                      TXT
                    </Button>
                    <Button onClick={handleCopy}>
                      <ClipboardCopy className="h-4 w-4" />
                      {copied ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-relaxed text-foreground">
                  {formatted}
                </pre>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
