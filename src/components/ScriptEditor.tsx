"use client";

import {
  BookOpen,
  ClipboardCopy,
  FilePlus2,
  FolderOpen,
  Play,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

import { CATEGORIES, CATEGORY_LABELS, CATEGORY_PLACEHOLDERS, FIXED_CHECKS } from "@/constants/test-data";
import { cn } from "@/lib/utils";
import type { ScriptEditorHook } from "@/hooks/useScriptEditor";
import type { TestItem } from "@/types";

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

interface ScriptEditorProps extends ScriptEditorHook {
  onInitExecution: (script: {
    functionality: string;
    environment: string;
    link: string;
    branch: string;
    tests: TestItem[];
  }) => void;
}

export function ScriptEditor({
  functionality, setFunctionality,
  environment, setEnvironment,
  link, setLink,
  branch, setBranch,
  tests,
  observations, setObservations,
  formatted,
  copied,
  jsonCopied,
  savedScripts,
  showSaved, setShowSaved,
  savedNotice,
  addTest, updateTest, removeTest,
  handleSave, handleLoad, handleDelete, handleNew,
  handleCopy, handleCopyJson, handleDownloadManual,
  onInitExecution,
}: ScriptEditorProps) {
  return (
    <>
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
            <Button variant="outline" onClick={handleDownloadManual} className="cursor-pointer">
              <BookOpen className="h-4 w-4" />
              Manual
            </Button>
            <Button variant="outline" onClick={handleNew} className="cursor-pointer">
              <FilePlus2 className="h-4 w-4" />
              Novo
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSaved((s) => !s)}
              className="cursor-pointer"
            >
              <FolderOpen className="h-4 w-4" />
              Salvos ({savedScripts.length})
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => onInitExecution({ functionality, environment, link, branch, tests })}
            >
              <Play className="h-4 w-4" />
              Executar
            </Button>
            <Button onClick={handleSave} className="cursor-pointer">
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
                      onClick={() => handleLoad(script)}
                      className="flex-1 text-left"
                    >
                      <p className="truncate text-sm font-medium">{script.name}</p>
                      <p className="text-xs text-muted-foreground">{script.createdAt}</p>
                    </button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onInitExecution(script)}
                        aria-label="Executar roteiro"
                        className="cursor-pointer"
                      >
                        <Play className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(script.id)}
                        aria-label="Excluir roteiro"
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
                  onChange={(e) => setFunctionality(e.target.value)}
                  placeholder="Nome da tela ou recurso"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Ambiente</Label>
                <Input
                  id="environment"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  placeholder="Ex: Homologação, Produção..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
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
                const currentTests = tests.filter((t) => t.category === category);
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
                            onChange={(e) => updateTest(test.id, e.target.value)}
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
                onChange={(e) => setObservations(e.target.value)}
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
                  <Button variant="outline" onClick={handleCopyJson}>
                    <ClipboardCopy className="h-4 w-4" />
                    {jsonCopied ? "Copiado" : "Copiar JSON"}
                  </Button>
                  <Button onClick={handleCopy}>
                    <ClipboardCopy className="h-4 w-4" />
                    {copied ? "Copiado" : "Copiar texto"}
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
    </>
  );
}
