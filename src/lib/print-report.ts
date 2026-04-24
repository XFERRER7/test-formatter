import type { ExecutionItem, ExecutionMeta } from "@/types";

const RESULT_LABEL: Record<ExecutionItem["result"], string> = {
  aprovado: "✅ Aprovado",
  reprovado: "❌ Reprovado",
  nao_aplicavel: "— Não aplicável",
  pendente: "⏳ Não avaliado",
};

const RESULT_COLOR: Record<ExecutionItem["result"], string> = {
  aprovado: "#16a34a",
  reprovado: "#dc2626",
  nao_aplicavel: "#64748b",
  pendente: "#d97706",
};

function row(label: string, value: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;font-size:13px;">${label}</td>
    <td style="padding:4px 0;font-size:13px;">${value}</td>
  </tr>`;
}

function itemRow(item: ExecutionItem) {
  const color = RESULT_COLOR[item.result];
  return `
    <div style="border:1px solid #e5e7eb;border-left:4px solid ${color};border-radius:6px;padding:10px 14px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div>
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;">${item.title}</span>
          <p style="margin:2px 0 0;font-size:14px;color:#111827;">${item.description}</p>
          ${item.notes ? `<p style="margin:4px 0 0;font-size:12px;color:#6b7280;font-style:italic;">Obs: ${item.notes}</p>` : ""}
        </div>
        <span style="white-space:nowrap;font-size:12px;font-weight:600;color:${color};">${RESULT_LABEL[item.result]}</span>
      </div>
    </div>`;
}

export function printExecutionReport(
  meta: ExecutionMeta,
  items: ExecutionItem[],
  startedAt: string
) {
  const total = items.length;
  const aprovado = items.filter((i) => i.result === "aprovado").length;
  const reprovado = items.filter((i) => i.result === "reprovado").length;
  const naoAplicavel = items.filter((i) => i.result === "nao_aplicavel").length;
  const pendente = items.filter((i) => i.result === "pendente").length;

  const customItems = items.filter((i) => !i.isFixed);
  const fixedItems = items.filter((i) => i.isFixed);

  const groupedCustom = new Map<string, ExecutionItem[]>();
  for (const item of customItems) {
    const list = groupedCustom.get(item.title) ?? [];
    list.push(item);
    groupedCustom.set(item.title, list);
  }

  const customSections = Array.from(groupedCustom.entries())
    .map(
      ([title, groupItems]) => `
      <h3 style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:16px 0 8px;">${title}</h3>
      ${groupItems.map(itemRow).join("")}`
    )
    .join("");

  const fixedSection = fixedItems.length
    ? `<h2 style="font-size:15px;font-weight:700;color:#1e1b4b;margin:24px 0 12px;padding-top:16px;border-top:1px solid #e5e7eb;">📌 Verificações Padrão</h2>
       ${fixedItems.map(itemRow).join("")}`
    : "";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório de Testes — ${meta.functionality || "Execução"}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 32px; }
    @media print {
      body { padding: 16px; }
      @page { margin: 1.5cm; size: A4; }
    }
  </style>
</head>
<body>
  <div style="max-width:800px;margin:0 auto;">

    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
      <div>
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6366f1;font-weight:600;margin-bottom:4px;">Relatório de Execução de Testes</p>
        <h1 style="font-size:22px;font-weight:700;color:#111827;">${meta.functionality || "Execução de Testes"}</h1>
      </div>
      <div style="text-align:right;font-size:11px;color:#6b7280;">
        <div>Gerado em: ${new Date().toLocaleString("pt-BR")}</div>
        ${startedAt ? `<div>Iniciado em: ${startedAt}</div>` : ""}
      </div>
    </div>

    <!-- Meta -->
    <table style="border-collapse:collapse;margin-bottom:20px;">
      ${row("Projeto", meta.project)}
      ${row("Ambiente", meta.environment)}
      ${row("Link", meta.link)}
      ${row("Branch", meta.branch)}
      ${row("Tester", meta.tester)}
      ${row("Desenvolvedor", meta.developer)}
    </table>

    <!-- Summary badges -->
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
      <div style="font-size:13px;"><strong>${total}</strong> <span style="color:#6b7280;">total</span></div>
      <div style="color:#16a34a;font-size:13px;"><strong>${aprovado}</strong> aprovados</div>
      <div style="color:#dc2626;font-size:13px;"><strong>${reprovado}</strong> reprovados</div>
      <div style="color:#64748b;font-size:13px;"><strong>${naoAplicavel}</strong> não aplicáveis</div>
      ${pendente > 0 ? `<div style="color:#d97706;font-size:13px;"><strong>${pendente}</strong> não avaliados</div>` : ""}
    </div>

    <!-- Custom items -->
    ${customItems.length ? `<h2 style="font-size:15px;font-weight:700;color:#1e1b4b;margin-bottom:12px;">📋 Checklist de Testes</h2>${customSections}` : ""}

    <!-- Fixed checks -->
    ${fixedSection}

  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.addEventListener("load", () => win.print());
}
