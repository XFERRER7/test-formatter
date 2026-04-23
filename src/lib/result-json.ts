import type {
  ExecutionItem,
  ExecutionMeta,
  ExecutionReportPayload,
  TestResult,
} from "@/types";

const VALID_RESULTS: TestResult[] = [
  "pendente",
  "aprovado",
  "reprovado",
  "nao_aplicavel",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTestResult(value: unknown): value is TestResult {
  return typeof value === "string" && VALID_RESULTS.includes(value as TestResult);
}

function isExecutionMeta(value: unknown): value is ExecutionMeta {
  return (
    isRecord(value) &&
    typeof value.functionality === "string" &&
    typeof value.environment === "string" &&
    typeof value.link === "string" &&
    typeof value.branch === "string"
  );
}

function isExecutionItem(value: unknown): value is ExecutionItem {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.isFixed === "boolean" &&
    isTestResult(value.result) &&
    typeof value.notes === "string"
  );
}

export function buildExecutionReportPayload(
  meta: ExecutionMeta,
  items: ExecutionItem[],
  executionStartedAt: string
): ExecutionReportPayload {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    executionStartedAt,
    meta,
    items,
  };
}

export function buildExecutionReportJson(
  meta: ExecutionMeta,
  items: ExecutionItem[],
  executionStartedAt: string
): string {
  return JSON.stringify(
    buildExecutionReportPayload(meta, items, executionStartedAt),
    null,
    2
  );
}

export function parseExecutionReportJson(input: string): {
  data: ExecutionReportPayload | null;
  error: string | null;
} {
  try {
    const parsed: unknown = JSON.parse(input);

    if (!isRecord(parsed)) {
      return { data: null, error: "O JSON deve ser um objeto válido." };
    }

    if (parsed.version !== 1) {
      return {
        data: null,
        error: "Versão de relatório inválida. Use um JSON exportado por esta ferramenta.",
      };
    }

    if (typeof parsed.generatedAt !== "string" || typeof parsed.executionStartedAt !== "string") {
      return {
        data: null,
        error: "O JSON está sem datas obrigatórias do relatório.",
      };
    }

    if (!isExecutionMeta(parsed.meta)) {
      return {
        data: null,
        error: "O bloco 'meta' do JSON está inválido.",
      };
    }

    if (!Array.isArray(parsed.items) || !parsed.items.every(isExecutionItem)) {
      return {
        data: null,
        error: "A lista de itens do relatório está inválida.",
      };
    }

    return {
      data: {
        version: 1,
        generatedAt: parsed.generatedAt,
        executionStartedAt: parsed.executionStartedAt,
        meta: parsed.meta,
        items: parsed.items,
      },
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Não foi possível ler o JSON. Verifique a formatação e tente novamente.",
    };
  }
}
