import { ArrowRight, ClipboardList, FileEdit, GitMerge, Sparkles } from "lucide-react";
import Link from "next/link";

import { AppNav } from "@/components/AppNav";

const FEATURES = [
  {
    href: "/criar",
    title: "Criar roteiro",
    description:
      "Organize cenários, observações e verificações padrão em um fluxo de edição focado em preparação.",
    icon: FileEdit,
    accent: "from-indigo-500 via-indigo-500 to-violet-500",
  },
  {
    href: "/executar",
    title: "Executar testes",
    description:
      "Avalie cada item, marque status, registre observações e gere o JSON que será enviado ao programador.",
    icon: ClipboardList,
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    href: "/validacao",
    title: "Validação de Build",
    description:
      "Cole múltiplos roteiros (JSON ou texto), mescle os cenários automaticamente e execute tudo de uma vez.",
    icon: GitMerge,
    accent: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <AppNav />

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(238,242,255,0.92),rgba(224,231,255,0.9))] p-8 shadow-[0_24px_90px_rgba(79,70,229,0.14)] backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Menu principal
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-balance">
              Fluxos claros para preparar, executar e validar testes.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/75">
              O QA monta o roteiro, executa os testes e exporta um relatório em PDF. Para validações de build, mescle múltiplos roteiros e execute tudo de uma vez.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/criar"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-indigo-300/40 transition-transform hover:-translate-y-0.5"
              >
                Começar pelo roteiro
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/validacao"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white"
              >
                Validação de Build
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group rounded-[28px] border border-white/60 bg-card/85 p-5 shadow-[0_18px_50px_rgba(79,70,229,0.08)] backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(79,70,229,0.14)]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${feature.accent} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold">{feature.title}</h2>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
