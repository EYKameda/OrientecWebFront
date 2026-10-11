import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output, forwardRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, of, timer } from 'rxjs';
import { catchError, debounce, distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { AutocompleteApiService, AutocompleteOption, AutocompleteTipo } from '../../core/api/autocomplete-api.service';

@Component({
  selector: 'orientec-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AutocompleteComponent), multi: true}],
  template: `
    <div class="orientec-autocomplete">
      <input
        type="text"
        [value]="texto"
        [placeholder]="placeholder"
        [disabled]="disabled"
        autocomplete="off"
        (input)="digitar(($any($event.target)).value)"
        (focus)="aberto = opcoes.length > 0"
        (blur)="fecharDepois()">
      <div class="autocomplete-loading" *ngIf="carregando">Consultando...</div>
      <div class="autocomplete-options" *ngIf="aberto && opcoes.length">
        <button type="button" *ngFor="let opcao of opcoes; trackBy: trackById" (mousedown)="$event.preventDefault()" (click)="selecionar(opcao)">
          {{opcao.label}}
        </button>
      </div>
    </div>
  `
})
export class AutocompleteComponent implements ControlValueAccessor {
  private readonly api = inject(AutocompleteApiService);
  private readonly entradas = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  @Input({required:true}) tipo!: AutocompleteTipo;
  @Input() placeholder = 'Digite para pesquisar...';
  @Input() minChars = 2;
  @Input() debounceMs = 300;
  @Output() selected = new EventEmitter<AutocompleteOption>();

  texto = '';
  opcoes: AutocompleteOption[] = [];
  carregando = false;
  aberto = false;
  disabled = false;

  private onChange: (value: number|string|null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.entradas.pipe(
      debounce(() => timer(this.debounceMs)),
      distinctUntilChanged(),
      switchMap(texto => {
        if (texto.length < this.minChars) {
          this.opcoes = [];
          this.aberto = false;
          return of([] as AutocompleteOption[]);
        }
        this.carregando = true;
        return this.api.buscar(this.tipo, texto).pipe(
          catchError(() => of([] as AutocompleteOption[])),
          finalize(() => this.carregando = false)
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(opcoes => {
      this.opcoes = opcoes;
      this.aberto = opcoes.length > 0;
    });
  }

  digitar(valor: string) {
    this.texto = valor;
    this.opcoes = [];
    this.onChange(null);
    this.entradas.next(valor.trim());
  }

  selecionar(opcao: AutocompleteOption) {
    this.texto = opcao.label;
    this.aberto = false;
    this.opcoes = [];
    this.onChange(opcao.id);
    this.onTouched();
    this.selected.emit(opcao);
  }

  fecharDepois() {
    window.setTimeout(() => this.aberto = false, 150);
    this.onTouched();
  }

  trackById(_: number, opcao: AutocompleteOption) { return opcao.id; }

  writeValue(value: number|string|null): void {
    if (value == null || value === '') {
      this.texto = '';
      return;
    }
  }

  registerOnChange(fn: (value: number|string|null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
