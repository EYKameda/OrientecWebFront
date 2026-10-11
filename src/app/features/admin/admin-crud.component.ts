import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminApiService } from '../../core/api/admin-api.service';
import { AdminResource, ADMIN_RESOURCES, adminFieldLabel } from './admin-resources';

type FieldType = 'text' | 'number' | 'checkbox' | 'date' | 'datetime-local' | 'password';
type FormValue = string | number | boolean | null;

interface AdminField {
  name: string;
  label: string;
  type: FieldType;
  step?: string;
}

const booleanFields = new Set([
  'ativo', 'moduloOs', 'moduloCadastros', 'moduloCaixa', 'moduloEstoque', 'moduloFinanceiro',
  'moduloGerencial', 'moduloPonto', 'moduloTabelas', 'moduloVendas', 'aguardaPecas',
  'aguardaFotos', 'aguardaNota', 'envioCredenciado', 'resolvida', 'retrocesso', 'ativa',
  'exigeAutorizacao', 'exigeOutroUsuario'
]);
const numericFields = new Set([
  'id', 'nivelCodigo', 'sedeCodigo', 'tempoOciosoMinutos', 'tempoMaximoSessaoMinutos',
  'marcaId', 'linhaId', 'familiaId', 'clienteId', 'equipamentoModeloId', 'origemId',
  'tipoGarantiaId', 'responsavelCodigo', 'sedeAtualCodigo', 'fornecedorId', 'ordemServicoId',
  'tipoPendenciaId', 'usuarioCodigo', 'sequencia', 'itemId', 'pedidoId', 'precoUnitario',
  'precoVenda', 'quantidade', 'total', 'valorPecas', 'valorServico', 'desconto', 'valorTotal',
  'destinoId', 'minNivel'
]);
const dateFields = new Set(['dataPedido']);
const dateTimeFields = new Set(['dataInclusao', 'dataResolucao', 'dataOrcamento']);
const decimalFields = new Set(['precoUnitario', 'precoVenda', 'quantidade', 'total', 'valorPecas', 'valorServico', 'desconto', 'valorTotal']);

function fieldType(name: string): FieldType {
  if (name === 'senha') return 'password';
  if (booleanFields.has(name)) return 'checkbox';
  if (dateFields.has(name)) return 'date';
  if (dateTimeFields.has(name)) return 'datetime-local';
  if (numericFields.has(name)) return 'number';
  return 'text';
}

function toFormValue(value: unknown, type: FieldType): FormValue {
  if (value === null || value === undefined) return type === 'checkbox' ? false : '';
  if (type === 'datetime-local' && typeof value === 'string') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
      return local.toISOString().slice(0, 16);
    }
  }
  if (type === 'date' && typeof value === 'string') return value.slice(0, 10);
  if (type === 'checkbox') return Boolean(value);
  return typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value);
}

function errorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const body = error.error;
    if (typeof body === 'object' && body !== null) {
      const record = body as Record<string, unknown>;
      const detail = record['detail'] ?? record['message'];
      if (typeof detail === 'string' && detail.trim()) return detail;
    }
  }
  return fallback;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="shell">
      <header><b>ORIENTEC / ADMINISTRAÇÃO</b><a routerLink="/admin">Todos os cadastros</a></header>
      <main>
        <div class="title">
          <div>
            <a routerLink="/admin">Administração</a>
            <h2>{{resource?.label ?? 'Cadastro'}}</h2>
          </div>
          <button type="button" (click)="recarregar()" [disabled]="loading">Atualizar</button>
        </div>
        <div class="erro" role="alert" *ngIf="error">{{error}}</div>
        <div class="success" role="status" *ngIf="success">{{success}}</div>
        <section class="panel">
          <h3>{{editingId === null ? 'Novo registro' : 'Editar registro'}}</h3>
          <form class="admin-form" (ngSubmit)="salvar()" #formRef="ngForm">
            <label *ngFor="let field of fields" [class.checkbox-field]="field.type === 'checkbox'">
              <ng-container *ngIf="field.type === 'checkbox'; else textInput">
                <input type="checkbox" [(ngModel)]="form[field.name]" [name]="field.name">
                {{field.label}}
              </ng-container>
              <ng-template #textInput>
                {{field.label}}
                <input [type]="field.type" [(ngModel)]="form[field.name]" [name]="field.name" [step]="field.step ?? null">
              </ng-template>
            </label>
            <div class="admin-form-actions">
              <button type="submit" [disabled]="saving || !resource">{{saving ? 'Salvando...' : editingId === null ? 'Criar' : 'Salvar alterações'}}</button>
              <button type="button" class="button-secondary" *ngIf="editingId !== null" (click)="novo()">Cancelar edição</button>
            </div>
          </form>
        </section>
        <section class="panel">
          <div class="title"><h3>Registros</h3><span class="hint" *ngIf="!loading">{{totalElements}} no total</span></div>
          <p class="hint" *ngIf="loading">Carregando...</p>
          <div class="table-wrap" *ngIf="!loading">
            <table>
              <thead><tr><th *ngFor="let column of columns">{{column.label}}</th><th>Ações</th></tr></thead>
              <tbody>
                <tr *ngFor="let record of records">
                  <td *ngFor="let column of columns">{{display(record[column.name])}}</td>
                  <td class="row-actions">
                    <button type="button" (click)="editar(record)" [disabled]="saving">Editar</button>
                    <button type="button" class="button-danger" (click)="excluir(record)" [disabled]="saving">Excluir</button>
                  </td>
                </tr>
                <tr *ngIf="!records.length"><td [attr.colspan]="columns.length + 1">Nenhum registro encontrado.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="pagination" *ngIf="resource?.paginated !== false">
            <button type="button" class="button-secondary" (click)="mudarPagina(-1)" [disabled]="loading || page <= 0">Anterior</button>
            <span>Página {{page + 1}} de {{totalPages || 1}}</span>
            <button type="button" class="button-secondary" (click)="mudarPagina(1)" [disabled]="loading || page + 1 >= totalPages">Próxima</button>
          </div>
        </section>
      </main>
    </div>
  `
})
export class AdminCrudComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);

  resource?: AdminResource;
  fields: AdminField[] = [];
  columns: AdminField[] = [];
  records: Record<string, unknown>[] = [];
  form: Record<string, FormValue> = {};
  editingId: string | number | null = null;
  page = 0;
  totalPages = 0;
  totalElements = 0;
  loading = false;
  saving = false;
  error = '';
  success = '';
  private readonly pageSize = 20;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const key = params.get('resource');
      this.resource = ADMIN_RESOURCES.find(candidate => candidate.key === key);
      if (!this.resource) {
        this.error = 'O cadastro solicitado não existe.';
        this.success = '';
        this.records = [];
        this.fields = [];
        this.columns = [];
        return;
      }
      this.records = [];
      this.totalElements = 0;
      this.totalPages = 0;
      this.fields = this.resource.fields.map(name => ({
        name,
        label: adminFieldLabel(name),
        type: fieldType(name),
        step: numericFields.has(name) ? '1' : decimalFields.has(name) ? '0.01' : undefined
      }));
      this.columns = this.buildColumns();
      this.page = 0;
      this.novo();
      this.recarregar();
    });
  }

  recarregar(): void {
    if (!this.resource) return;
    this.loading = true;
    this.error = '';
    this.api.listar(this.resource, this.page, this.pageSize).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: result => {
        this.records = result.content;
        this.totalElements = result.totalElements;
        this.totalPages = result.totalPages;
        this.page = result.page;
        this.loading = false;
      },
      error: error => {
        this.error = errorMessage(error, 'Não foi possível carregar os registros.');
        this.loading = false;
      }
    });
  }

  salvar(): void {
    if (!this.resource || this.saving) return;
    const body = this.buildBody();
    this.saving = true;
    this.error = '';
    this.success = '';
    const creating = this.editingId === null;
    const editingId = this.editingId;
    const request = editingId === null
      ? this.api.criar(this.resource, body)
      : this.api.atualizar(this.resource, editingId, body);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving = false;
        this.novo();
        this.success = creating ? 'Registro criado com sucesso.' : 'Registro atualizado com sucesso.';
        this.recarregar();
      },
      error: error => {
        this.error = errorMessage(error, 'Não foi possível salvar o registro.');
        this.saving = false;
      }
    });
  }

  editar(record: Record<string, unknown>): void {
    if (!this.resource) return;
    const id = record[this.resource.idField];
    if (typeof id !== 'string' && typeof id !== 'number') {
      this.error = `Não foi possível identificar o registro pelo campo ${this.resource.idField}.`;
      return;
    }
    this.error = '';
    this.success = '';
    this.saving = true;
    this.api.buscar(this.resource, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: fullRecord => {
        this.editingId = id;
        this.form = Object.fromEntries(this.fields.map(field => [field.name, toFormValue(fullRecord[field.name], field.type)]));
        this.saving = false;
      },
      error: error => {
        this.error = errorMessage(error, 'Não foi possível carregar o registro para edição.');
        this.saving = false;
      }
    });
  }

  excluir(record: Record<string, unknown>): void {
    if (!this.resource) return;
    const id = record[this.resource.idField];
    if ((typeof id !== 'string' && typeof id !== 'number') || !window.confirm(`Excluir este registro de ${this.resource.label.toLowerCase()}?`)) return;
    this.error = '';
    this.success = '';
    this.saving = true;
    this.api.excluir(this.resource, id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.success = 'Registro excluído com sucesso.';
        this.saving = false;
        if (this.records.length === 1 && this.page > 0) this.page--;
        this.recarregar();
      },
      error: error => {
        this.error = errorMessage(error, 'Não foi possível excluir o registro.');
        this.saving = false;
      }
    });
  }

  novo(): void {
    this.editingId = null;
    this.form = Object.fromEntries(this.fields.map(field => [field.name, field.type === 'checkbox' ? false : '']));
    this.error = '';
    this.success = '';
  }

  mudarPagina(offset: number): void {
    this.page += offset;
    this.recarregar();
  }

  display(value: unknown): string {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private buildColumns(): AdminField[] {
    const idField = this.resource?.idField ?? 'id';
    const names = [idField, ...this.fields.map(field => field.name).filter(name => name !== idField)].slice(0, 5);
    return names.map(name => this.fields.find(field => field.name === name) ?? {
      name,
      label: adminFieldLabel(name),
      type: 'text',
      step: undefined
    });
  }

  private buildBody(): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    for (const field of this.fields) {
      const value = this.form[field.name];
      if (field.type === 'password' && !value) continue;
      if (field.type === 'number') {
        body[field.name] = value === '' || value === null ? null : Number(value);
      } else if (field.type === 'datetime-local') {
        body[field.name] = typeof value === 'string' && value ? new Date(value).toISOString() : null;
      } else {
        body[field.name] = value;
      }
    }
    return body;
  }
}
