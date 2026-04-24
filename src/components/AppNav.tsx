"use client";

import { ClipboardList, Compass, FileEdit, GitMerge } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/criar",
    label: "Criar roteiro",
    description: "Monte o checklist e prepare a execução.",
    icon: FileEdit,
  },
  {
    href: "/executar",
    label: "Executar testes",
    description: "Avalie os itens e gere o JSON do relatório.",
    icon: ClipboardList,
  },
  {
    href: "/validacao",
    label: "Validação de Build",
    description: "Mescle múltiplos roteiros e execute de uma vez.",
    icon: GitMerge,
  },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="mb-8 rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(238,242,255,0.92),rgba(224,231,255,0.94))] p-2 shadow-[0_20px_80px_rgba(79,70,229,0.12)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-[22px] px-4 py-3 transition-colors hover:bg-white/60"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f46e5,#6366f1,#818cf8)] text-white shadow-lg shadow-indigo-300/50">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">
              Test Formatter
            </p>
            <p className="text-sm text-foreground/80">
              Fluxos separados para QA, execução e leitura técnica.
            </p>
          </div>
        </Link>

        <nav className="grid gap-2 md:grid-cols-3 lg:min-w-[760px]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group rounded-[22px] border px-4 py-3 transition-all duration-200",
                  isActive
                    ? "border-primary/30 bg-[linear-gradient(135deg,rgba(79,70,229,0.16),rgba(99,102,241,0.08))] shadow-sm"
                    : "border-transparent bg-white/55 hover:border-primary/20 hover:bg-white/80"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors",
                      isActive
                        ? "border-primary/20 bg-primary text-primary-foreground"
                        : "border-border bg-background text-primary group-hover:border-primary/20"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
