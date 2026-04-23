import type { ExecutionItem, ExecutionMeta } from "@/types";

export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildExecutionResultText(
  executionScript: ExecutionMeta,
  executionItems: ExecutionItem[],
  executionStartedAt: string
): string {
  const lines: string[] = [];

  lines.push("📋 Resultado da Execução de Testes");
  lines.push(`Funcionalidade: ${executionScript.functionality}`);
  lines.push(`Ambiente: ${executionScript.environment}`);
  if (executionScript.link) lines.push(`Link: ${executionScript.link}`);
  if (executionScript.branch) lines.push(`Branch: ${executionScript.branch}`);
  lines.push(`Iniciado em: ${executionStartedAt}`);
  lines.push(`Exportado em: ${new Date().toLocaleString("pt-BR")}`);
  lines.push("");

  const total = executionItems.length;
  const aprovado = executionItems.filter((i) => i.result === "aprovado").length;
  const reprovado = executionItems.filter((i) => i.result === "reprovado").length;
  const naoAplicavel = executionItems.filter((i) => i.result === "nao_aplicavel").length;
  const pendente = executionItems.filter((i) => i.result === "pendente").length;

  lines.push(
    `Resumo: ${total} itens | ✅ ${aprovado} aprovados | ❌ ${reprovado} reprovados | — ${naoAplicavel} não aplicáveis | ⏳ ${pendente} não avaliados`
  );
  lines.push("");

  const icon = (result: ExecutionItem["result"]) =>
    result === "aprovado" ? "✅" : result === "reprovado" ? "❌" : result === "nao_aplicavel" ? "—" : "⏳";

  const customItems = executionItems.filter((i) => !i.isFixed);
  if (customItems.length > 0) {
    lines.push("📋 Checklist de Testes:");
    for (const item of customItems) {
      lines.push(`${icon(item.result)} [${item.title}] ${item.description}`);
      if (item.notes) lines.push(`   Obs: ${item.notes}`);
      lines.push("");
    }
  }

  const fixedItems = executionItems.filter((i) => i.isFixed);
  if (fixedItems.length > 0) {
    lines.push("📌 Verificações Padrão:");
    for (const item of fixedItems) {
      lines.push(`${icon(item.result)} ${item.title}: ${item.description}`);
      if (item.notes) lines.push(`   Obs: ${item.notes}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}
