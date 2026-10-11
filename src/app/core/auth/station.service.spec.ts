import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { StationService } from './station.service';

describe('StationService', () => {
  let service: StationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StationService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta a sessão da estação com credentials', () => {
    service.authorized().subscribe(result => expect(result.authorized).toBeTrue());
    const req = http.expectOne('/api/v1/stations/session');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ authorized: true, sedeCodigo: 2 });
  });

  it('faz exchange como POST sem modificar o método', () => {
    service.exchange('abc').subscribe();
    const req = http.expectOne('/api/v1/stations/exchange');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ code: 'abc' });
    req.flush(null);
  });
});
