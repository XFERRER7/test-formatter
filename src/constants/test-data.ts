import type { TestCategory } from "@/types";

export const CATEGORIES: TestCategory[] = [
  "caminho_feliz",
  "validacao",
  "regra_negocio",
  "impacto_indireto",
];

export const CATEGORY_LABELS: Record<TestCategory, string> = {
  caminho_feliz: "Caminho Feliz",
  validacao: "Validação",
  regra_negocio: "Regra de Negócio",
  impacto_indireto: "Impacto Indireto",
};

export const CATEGORY_PLACEHOLDERS: Record<TestCategory, string> = {
  caminho_feliz: "Ex: Realizar um cadastro completo e verificar se salvou no banco",
  validacao: "Ex: Tentar salvar sem o campo CPF e ver se o erro aparece",
  regra_negocio:
    "Ex: Verificar se o nome do usuário é exibido corretamente em letras maiúsculas, conforme a regra de negócio",
  impacto_indireto: "Ex: Abrir a listagem e ver se o novo item aparece lá",
};

export const FIXED_CHECKS: { title: string; description: string }[] = [
  {
    title: "Ortografia",
    description: "Existem erros de português nos rótulos, botões ou mensagens de alerta?",
  },
  {
    title: "Campos Obrigatórios",
    description:
      "Se eu deixar um campo obrigatório vazio e tentar salvar, o sistema barra ou dá erro de código (500)?",
  },
  {
    title: "Tipagem de Campos",
    description:
      "Tentar inserir letras em campos de número (ex: valor, telefone) ou símbolos em campos de nome.",
  },
  {
    title: "Limites de Caracteres",
    description:
      'Tentar colar um texto gigante em um campo pequeno para ver se o layout "explode" ou se o banco corta o texto.',
  },
  {
    title: "Funcionamento ao redor",
    description:
      "A alteração afetou algo que já estava funcionando ao redor? Testar as funcionalidades relacionadas para garantir que não houve regressão.",
  },
  {
    title: "Responsividade",
    description:
      "Testar a interface em diferentes tamanhos de tela para garantir que os elementos se ajustem corretamente.",
  },
  {
    title: "Testar cenários mais próximos da realidade",
    description:
      "Executar testes que simulem situações reais de uso para garantir que o sistema se comporta corretamente em condições práticas.",
  },
];

export const LABEL_TO_CATEGORY: Record<string, string> = {
  "Caminho Feliz": "caminho_feliz",
  Validação: "validacao",
  "Regra de Negócio": "regra_negocio",
  "Impacto Indireto": "impacto_indireto",
};

export const MANUAL_CONTENT = `📘 Manual de Testes

1. Validar o objetivo da task
Antes de iniciar os testes, confirmar se a implementação atende exatamente ao que foi solicitado.
Verificar:
- Se a funcionalidade foi desenvolvida conforme a descrição da task
- Se regras de negócio foram respeitadas
- Se não ficou nada pendente ou parcialmente implementado
- Se nomes, textos, labels e mensagens estão corretos

2. Testar o fluxo principal
Executar o cenário principal esperado da funcionalidade.
Verificar:
- Se o fluxo funciona do início ao fim
- Se o resultado final é o esperado
- Se não ocorre erro visual ou de sistema
- Se os dados exibidos/salvos estão corretos
Exemplo: Criar > Editar > Salvar > Consultar resultado

3. Testar cenários alternativos
Validar comportamentos diferentes do fluxo principal, mas ainda esperados.
Verificar:
- Ações com dados diferentes
- Variações de preenchimento
- Mudança de status
- Diferentes perfis de usuário, se houver
- Comportamento em outras rotas/telas relacionadas

4. Testar validações
Garantir que o sistema impede entradas inválidas e orienta o usuário corretamente.
Verificar:
- Campos obrigatórios
- Formatos inválidos
- Limites de caracteres
- Valores nulos, vazios ou inconsistentes
- Mensagens de erro exibidas corretamente

5. Testar cenários negativos
Executar ações incorretas ou fora do esperado para validar a segurança da funcionalidade.
Verificar:
- Se o sistema bloqueia operações indevidas
- Se não quebra ao receber dados incorretos
- Se apresenta mensagens claras
- Se mantém a integridade das informações

6. Validar persistência de dados
Confirmar que os dados foram gravados, atualizados ou removidos corretamente.
Verificar:
- Se salvou no banco corretamente
- Se refletiu na interface
- Se após atualizar a página os dados permanecem corretos
- Se não houve duplicidade de registros
- Se não houve perda de dados existentes

7. Validar impacto em funcionalidades relacionadas
Garantir que a alteração não afetou outras partes do sistema.
Verificar:
- Telas relacionadas
- Fluxos dependentes
- Integrações
- Relatórios
- Listagens, filtros e dashboards afetados
- Regras que usam o mesmo dado ou serviço

8. Realizar teste de regressão básica
Executar uma checagem rápida nas funcionalidades próximas à alteração.
Verificar:
- Se o que já funcionava continua funcionando
- Se endpoints compartilhados continuam respondendo corretamente
- Se componentes reutilizados não foram impactados
- Se permissões e acessos continuam corretos

9. Validar interface e usabilidade
Conferir se a entrega está visualmente correta e coerente com o sistema.
Verificar:
- Alinhamento visual
- Responsividade, quando aplicável
- Botões, ícones e textos
- Estados de carregamento
- Mensagens de sucesso/erro
- Comportamento de modal, tabela, formulário e paginação, se houver

10. Validar logs e erros
Garantir que não existem erros ocultos mesmo quando a funcionalidade aparentemente funciona.
Verificar:
- Console do navegador
- Network das requisições
- Logs do backend
- Erros de build ou warnings relevantes
- Status HTTP corretos`.trim();
