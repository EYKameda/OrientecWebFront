# Testes do Frontend

Os testes cobrem o fluxo crítico da estação:

- consulta de sessão com `withCredentials`;
- exchange do código one-shot;
- navegação para login após autorização;
- falha do código sem retry do `POST /exchange`.

Para medir cobertura:

```bash
npm ci
ng test --watch=false --code-coverage
```

O retry automático fica restrito a operações idempotentes no interceptor. Operações de negócio `POST/PUT/PATCH/DELETE` não são repetidas automaticamente.
