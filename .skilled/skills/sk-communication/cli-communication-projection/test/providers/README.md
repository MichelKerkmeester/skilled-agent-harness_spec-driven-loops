# Provider Tests

## 1. OVERVIEW

`test/providers/` verifies provider wire formats, bounded route execution, privacy-first selection and model-scoped capability records. The performance suite checks provider routing overhead without live provider access.

---

## 2. FILES

| File | Coverage |
|---|---|
| `adapters.test.ts` | OpenAI-compatible and Ollama request and response mapping |
| `executor.test.ts` | Attempt plans, deadlines, cancellation and exact-original results |
| `helpers.ts` | Shared provider records, prompts and transport builders |
| `performance.test.ts` | Provider routing latency benchmark |
| `privacy.test.ts` | Consent, privacy classes, freshness and fallback rules |
| `registry.test.ts` | Provider validation and capability snapshot merging |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/providers
```

Expected result: all provider tests pass.

---

## 4. RELATED

- [Providers subsystem](../../src/providers/README.md)
- [Privacy subsystem](../../src/privacy/README.md)
