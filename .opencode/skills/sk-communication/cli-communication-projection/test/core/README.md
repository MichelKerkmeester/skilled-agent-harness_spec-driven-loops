# Core Pipeline Tests

## 1. OVERVIEW

`test/core/` verifies generation-keyed assembly, runtime-neutral normalization, bounded context selection and content-free core evidence. The performance suite checks the provisional latency budgets under serial execution.

---

## 2. FILES

| File | Coverage |
|---|---|
| `assembler.test.ts` | Generation lifecycle, ordering, bounds, duplicates and exact-original fallback |
| `context-selector.test.ts` | Freshness, privacy, truncation and no-context behavior |
| `evidence.test.ts` | Content-free assembly and core telemetry |
| `helpers.ts` | Shared event and exact-original test builders |
| `normalizer.test.ts` | Validation, immutable normalization and replay-stable digests |
| `performance.test.ts` | Core pipeline latency benchmark |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/core
```

Expected result: all core pipeline tests pass.

---

## 4. RELATED

- [Core subsystem](../../src/core/README.md)
- [Context subsystem](../../src/context/README.md)
