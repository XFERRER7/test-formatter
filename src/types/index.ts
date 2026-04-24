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
  project: string;
  functionality: string;
  environment: string;
  link: string;
  branch: string;
  tester: string;
  developer: string;
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
  project: string;
  functionality: string;
  environment: string;
  link: string;
  branch: string;
  tester: string;
  developer: string;
}

export interface ExecutionDraft {
  project: string;
  functionality: string;
  environment: string;
  link: string;
  branch: string;
  tester: string;
  developer: string;
  tests: TestItem[];
}

export interface ExecutionReportPayload {
  version: 1;
  generatedAt: string;
  executionStartedAt: string;
  meta: ExecutionMeta;
  items: ExecutionItem[];
}

export type ActiveView = "criar" | "executar";
