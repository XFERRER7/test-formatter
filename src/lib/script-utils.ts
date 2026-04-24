import {
  CATEGORIES,
  CATEGORY_LABELS,
  FIXED_CHECKS,
  LABEL_TO_CATEGORY,
} from "@/constants/test-data";
import type { ExecutionItem, ExecutionMeta, TestCategory, TestItem } from "@/types";

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function createEmptyTest(category: TestCategory): TestItem {
  return { id: generateId(), category, description: "" };
}

export function createInitialTests(): TestItem[] {
  return CATEGORIES.map((category) => createEmptyTest(category));
}

export function formatScript(script: {
  functionality: string;
  environment: string;
  link: string;
  branch: string;
  tester: string;
  developer: string;
  tests: TestItem[];
  observations: string;
}): string {
  const lines: string[] = [];
  lines.push("🛠️ Roteiro de Teste");
  lines.push(`Funcionalidade: ${script.functionality}`);
  lines.push(`Ambiente: ${script.environment}`);
  if (script.link) lines.push(`Link: ${script.link}`);
  if (script.branch) lines.push(`Branch: ${script.branch}`);
  if (script.tester) lines.push(`Tester: ${script.tester}`);
  if (script.developer) lines.push(`Desenvolvedor: ${script.developer}`);
  lines.push("");
  lines.push("📋 O que testar (Checklist):");

  for (const category of CATEGORIES) {
    const items = script.tests.filter((t) => t.category === category);
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

export function buildExecutionItems(items: TestItem[]): ExecutionItem[] {
  const result: ExecutionItem[] = [];

  for (const test of items) {
    if (test.description.trim()) {
      result.push({
        id: test.id,
        title: CATEGORY_LABELS[test.category],
        description: test.description,
        category: test.category,
        isFixed: false,
        result: "pendente",
        notes: "",
      });
    }
  }

  for (const check of FIXED_CHECKS) {
    result.push({
      id: generateId(),
      title: check.title,
      description: check.description,
      category: "padrao",
      isFixed: true,
      result: "pendente",
      notes: "",
    });
  }

  return result;
}

export function parseScriptText(text: string): {
  meta: ExecutionMeta;
  items: ExecutionItem[];
} | null {
  const lines = text.split("\n");
  let functionality = "";
  let environment = "";
  let link = "";
  let branch = "";
  let tester = "";
  let developer = "";
  const items: ExecutionItem[] = [];
  let section: "header" | "checklist" | "observations" | "padrao" = "header";

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("Funcionalidade:")) {
      functionality = line.replace("Funcionalidade:", "").trim();
    } else if (line.startsWith("Ambiente:")) {
      environment = line.replace("Ambiente:", "").trim();
    } else if (line.startsWith("Link:")) {
      link = line.replace("Link:", "").trim();
    } else if (line.startsWith("Branch:")) {
      branch = line.replace("Branch:", "").trim();
    } else if (line.startsWith("Tester:")) {
      tester = line.replace("Tester:", "").trim();
    } else if (line.startsWith("Desenvolvedor:")) {
      developer = line.replace("Desenvolvedor:", "").trim();
    } else if (line.startsWith("📋")) {
      section = "checklist";
    } else if (line.startsWith("⚠️")) {
      section = "observations";
    } else if (line.startsWith("📌")) {
      section = "padrao";
    } else if (
      line.startsWith("[ ]") ||
      line.startsWith("[x]") ||
      line.startsWith("[X]")
    ) {
      const content = line.replace(/^\[.?\]\s*/, "");
      const colonIdx = content.indexOf(":");
      if (colonIdx === -1) continue;
      const left = content.substring(0, colonIdx).trim();
      const right = content.substring(colonIdx + 1).trim();
      if (!right) continue;

      if (section === "checklist") {
        items.push({
          id: generateId(),
          title: left,
          description: right,
          category: LABEL_TO_CATEGORY[left] ?? "caminho_feliz",
          isFixed: false,
          result: "pendente",
          notes: "",
        });
      } else if (section === "padrao") {
        items.push({
          id: generateId(),
          title: left,
          description: right,
          category: "padrao",
          isFixed: true,
          result: "pendente",
          notes: "",
        });
      }
    }
  }

  if (items.length === 0 && !functionality) return null;
  return { meta: { functionality, environment, link, branch, tester, developer }, items };
}
