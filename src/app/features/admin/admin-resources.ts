export interface AdminResource {
  key: string;
  label: string;
  endpoint: string;
  idField: string;
  fields: string[];
  paginated?: boolean;
  sort?: string;
}

export interface AdminResourceGroup {
  label: string;
  resources: AdminResource[];
}

const groups: AdminResourceGroup[] = [
  {
    label: 'Acesso e estrutura',
    resources: [
      { key: 'usuarios', label: 'Usuários', endpoint: '/api/v1/usuarios', idField: 'codigo', fields: ['nome', 'apelido', 'login', 'senha', 'nivelCodigo', 'sedeCodigo', 'ativo', 'tempoOciosoMinutos', 'tempoMaximoSessaoMinutos', 'moduloOs', 'moduloCadastros', 'moduloCaixa', 'moduloEstoque', 'moduloFinanceiro', 'moduloGerencial', 'moduloPonto', 'moduloTabelas', 'moduloVendas'], paginated: false },
      { key: 'sedes', label: 'Sedes', endpoint: '/api/v1/sedes', idField: 'codigo', fields: ['descricao', 'sigla', 'ativo'], sort: 'codigo' },
      { key: 'permissao', label: 'Permissões', endpoint: '/api/v1/permissao', idField: 'id', fields: ['id', 'codigo', 'descricao', 'modulo', 'ativo'] }
    ]
  },
  {
    label: 'Catálogo e equipamentos',
    resources: [
      { key: 'marca', label: 'Marcas', endpoint: '/api/v1/marca', idField: 'id', fields: ['id', 'descricao', 'ativo'] },
      { key: 'linha', label: 'Linhas', endpoint: '/api/v1/linha', idField: 'id', fields: ['id', 'descricao', 'ativo'] },
      { key: 'modelo', label: 'Modelos', endpoint: '/api/v1/modelo', idField: 'id', fields: ['id', 'marcaId', 'linhaId', 'descricao', 'complemento', 'ativo'] },
      { key: 'familia', label: 'Famílias', endpoint: '/api/v1/familia', idField: 'id', fields: ['id', 'descricao', 'ativo'] },
      { key: 'item', label: 'Itens', endpoint: '/api/v1/item', idField: 'id', fields: ['id', 'descricao', 'aplicacao', 'codigoBarras', 'familiaId', 'ativo'] },
      { key: 'acessorio', label: 'Acessórios', endpoint: '/api/v1/acessorio', idField: 'id', fields: ['id', 'descricao', 'ativo'] },
      { key: 'defeito', label: 'Defeitos', endpoint: '/api/v1/defeito', idField: 'id', fields: ['id', 'descricao', 'ativo'] }
    ]
  },
  {
    label: 'Pessoas e parceiros',
    resources: [
      { key: 'cliente', label: 'Clientes', endpoint: '/api/v1/cliente', idField: 'id', fields: ['id', 'nome', 'cpfCnpj', 'telefone', 'celular', 'email', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'uf', 'cep', 'ativo'] },
      { key: 'fornecedor', label: 'Fornecedores', endpoint: '/api/v1/fornecedor', idField: 'id', fields: ['id', 'nome', 'fantasia', 'cnpj', 'cpf', 'ativo'] },
      { key: 'credenciado', label: 'Credenciados', endpoint: '/api/v1/credenciado', idField: 'id', fields: ['id', 'nome', 'fantasia', 'cnpj', 'cpf', 'ativo'] }
    ]
  },
  {
    label: 'Ordens de serviço e pedidos',
    resources: [
      { key: 'os', label: 'Ordens de serviço', endpoint: '/api/v1/os', idField: 'id', fields: ['clienteId', 'equipamentoModeloId', 'origemId', 'tipoGarantiaId', 'responsavelCodigo', 'sedeAtualCodigo', 'defeitoRelatado', 'observacao', 'aguardaPecas', 'aguardaFotos', 'aguardaNota', 'envioCredenciado'] },
      { key: 'pedido', label: 'Pedidos', endpoint: '/api/v1/pedido', idField: 'id', fields: ['id', 'fornecedorId', 'dataPedido', 'situacao', 'observacao', 'ativo'] },
      { key: 'ordem_servico_pendencia', label: 'Pendências de OS', endpoint: '/api/v1/ordem_servico_pendencia', idField: 'id', fields: ['id', 'ordemServicoId', 'tipoPendenciaId', 'descricao', 'dataInclusao', 'dataResolucao', 'resolvida', 'usuarioCodigo'] },
      { key: 'ordem_servico_peca', label: 'Peças de OS', endpoint: '/api/v1/ordem_servico_peca', idField: 'id', fields: ['id', 'ordemServicoId', 'sequencia', 'itemId', 'pedidoId', 'descricaoSnapshot', 'fornecedorId', 'precoUnitario', 'precoVenda', 'quantidade', 'total'] },
      { key: 'ordem_servico_orcamento', label: 'Orçamentos de OS', endpoint: '/api/v1/ordem_servico_orcamento', idField: 'id', fields: ['id', 'ordemServicoId', 'valorPecas', 'valorServico', 'desconto', 'valorTotal', 'dataOrcamento', 'usuarioCodigo', 'observacao'] }
    ]
  },
  {
    label: 'Tipos e regras de fluxo',
    resources: [
      { key: 'os-status', label: 'Situações de OS', endpoint: '/api/v1/os-status', idField: 'id', fields: ['id', 'codigo', 'descricao', 'ativo'] },
      { key: 'origem_os', label: 'Origens de OS', endpoint: '/api/v1/origem_os', idField: 'id', fields: ['id', 'descricao', 'ativo'] },
      { key: 'tipo_garantia', label: 'Tipos de garantia', endpoint: '/api/v1/tipo_garantia', idField: 'id', fields: ['id', 'codigo', 'descricao', 'ativo'] },
      { key: 'tipo_pendencia', label: 'Tipos de pendência', endpoint: '/api/v1/tipo_pendencia', idField: 'id', fields: ['id', 'codigo', 'descricao', 'ativo'] },
      { key: 'regras-transicao-os', label: 'Regras de transição de OS', endpoint: '/api/v1/regras-transicao-os', idField: 'id', fields: ['id', 'origemId', 'destinoId', 'minNivel', 'retrocesso', 'ativa', 'descricao', 'tipoTransicao', 'exigeAutorizacao', 'permissaoExecucao', 'permissaoAutorizacao', 'exigeOutroUsuario', 'metodoAutorizacao'] },
      { key: 'regras-operacao-os', label: 'Regras de operação de OS', endpoint: '/api/v1/regras-operacao-os', idField: 'id', fields: ['codigo', 'descricao', 'permissaoExecucao', 'permissaoAutorizacao', 'metodoAutorizacao', 'observacao', 'exigeAutorizacao', 'exigeOutroUsuario', 'ativo'] }
    ]
  }
];

export const ADMIN_RESOURCE_GROUPS = groups;
export const ADMIN_RESOURCES = groups.flatMap(group => group.resources);

const labels: Record<string, string> = {
  nome: 'Nome',
  apelido: 'Apelido',
  login: 'Login',
  senha: 'Senha',
  nivelCodigo: 'Código do nível',
  sedeCodigo: 'Código da sede',
  ativo: 'Ativo',
  tempoOciosoMinutos: 'Tempo ocioso (minutos)',
  tempoMaximoSessaoMinutos: 'Tempo máximo de sessão (minutos)',
  moduloOs: 'Módulo OS',
  moduloCadastros: 'Módulo cadastros',
  moduloCaixa: 'Módulo caixa',
  moduloEstoque: 'Módulo estoque',
  moduloFinanceiro: 'Módulo financeiro',
  moduloGerencial: 'Módulo gerencial',
  moduloPonto: 'Módulo ponto',
  moduloTabelas: 'Módulo tabelas',
  moduloVendas: 'Módulo vendas',
  codigo: 'Código',
  descricao: 'Descrição',
  marcaId: 'Marca (código)',
  linhaId: 'Linha (código)',
  complemento: 'Complemento',
  aplicacao: 'Aplicação',
  codigoBarras: 'Código de barras',
  familiaId: 'Família (código)',
  cpfCnpj: 'CPF/CNPJ',
  telefone: 'Telefone',
  celular: 'Celular',
  email: 'E-mail',
  endereco: 'Endereço',
  numero: 'Número',
  bairro: 'Bairro',
  cidade: 'Cidade',
  uf: 'UF',
  cep: 'CEP',
  fantasia: 'Nome fantasia',
  cnpj: 'CNPJ',
  cpf: 'CPF',
  clienteId: 'Cliente (código)',
  equipamentoModeloId: 'Modelo do equipamento (código)',
  origemId: 'Origem (código)',
  tipoGarantiaId: 'Tipo de garantia (código)',
  responsavelCodigo: 'Responsável (código)',
  sedeAtualCodigo: 'Sede atual (código)',
  defeitoRelatado: 'Defeito relatado',
  observacao: 'Observação',
  aguardaPecas: 'Aguarda peças',
  aguardaFotos: 'Aguarda fotos',
  aguardaNota: 'Aguarda nota',
  envioCredenciado: 'Envio para credenciado',
  fornecedorId: 'Fornecedor (código)',
  dataPedido: 'Data do pedido',
  situacao: 'Situação',
  ordemServicoId: 'Ordem de serviço (código)',
  tipoPendenciaId: 'Tipo de pendência (código)',
  dataInclusao: 'Data de inclusão',
  dataResolucao: 'Data de resolução',
  resolvida: 'Resolvida',
  usuarioCodigo: 'Usuário (código)',
  sequencia: 'Sequência',
  itemId: 'Item (código)',
  pedidoId: 'Pedido (código)',
  descricaoSnapshot: 'Descrição da peça',
  precoUnitario: 'Preço unitário',
  precoVenda: 'Preço de venda',
  quantidade: 'Quantidade',
  total: 'Total',
  valorPecas: 'Valor das peças',
  valorServico: 'Valor do serviço',
  desconto: 'Desconto',
  valorTotal: 'Valor total',
  dataOrcamento: 'Data do orçamento',
  destinoId: 'Destino (código)',
  minNivel: 'Nível mínimo',
  retrocesso: 'Permite retrocesso',
  ativa: 'Ativa',
  tipoTransicao: 'Tipo de transição',
  exigeAutorizacao: 'Exige autorização',
  permissaoExecucao: 'Permissão de execução',
  permissaoAutorizacao: 'Permissão de autorização',
  exigeOutroUsuario: 'Exige outro usuário',
  metodoAutorizacao: 'Método de autorização',
  modulo: 'Módulo'
};

export function adminFieldLabel(name: string): string {
  return labels[name] ?? name.replace(/([A-Z])/g, ' $1').replace(/^./, first => first.toUpperCase());
}
