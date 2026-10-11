import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StationStartComponent } from './station-start.component';
import { StationService } from '../core/auth/station.service';

describe('StationStartComponent', () => {
  let fixture: ComponentFixture<StationStartComponent>;
  let component: StationStartComponent;
  let station: jasmine.SpyObj<StationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    station = jasmine.createSpyObj('StationService', ['exchange', 'authorized']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    station.exchange.and.returnValue(of({}));
    station.authorized.and.returnValue(of({ authorized: true, sedeCodigo: 2 }));

    await TestBed.configureTestingModule({
      imports: [StationStartComponent],
      providers: [
        { provide: StationService, useValue: station },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => 'abc' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StationStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('troca o código e navega para login quando autorizado', () => {
    expect(station.exchange).toHaveBeenCalledWith('abc');
    expect(station.authorized).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('não repete exchange quando o código one-shot falha', () => {
    station.exchange.calls.reset();
    router.navigateByUrl.calls.reset();
    station.exchange.and.returnValue(throwError(() => ({ error: { detail: 'Código expirado' } })));
    // O comportamento principal é exercitado na criação seguinte.
    fixture.destroy();
    fixture = TestBed.createComponent(StationStartComponent);
    fixture.detectChanges();
    expect(station.exchange).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).not.toHaveBeenCalledWith('/login');
  });
});
