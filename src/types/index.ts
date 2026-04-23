export type TestCategory =
  | "caminho_feliz"
  | "validacao"
  | "regra_negocio"
  | "impacto_indireto";

export interface TestItem {
  id: string;
  category: TestCategory;
  description: string;
}

export interface TestScript {
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

export type TestResult = "pendente" | "aprovado" | "reprovado" | "nao_aplicavel";

export interface ExecutionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  isFixed: boolean;
  result: TestResult;
  notes: string;
}

export interface ExecutionMeta {
  functionality: string;
  environment: string;
  link: string;
  branch: string;
}

export interface ExecutionDraft {
  functionality: string;
  environment: string;
  link: string;
  branch: string;
  tests: TestItem[];
}

export interface ExecutionReportPayload {
  version: 1;
  generatedAt: string;
  executionStartedAt: string;
  meta: ExecutionMeta;
  items: ExecutionItem[];
}

export type ActiveView = "criar" | "executar" | "resultados";
