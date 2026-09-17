# Fidelity and Render Tests

## 1. OVERVIEW

`test/fidelity/` verifies Markdown protection, protected-span restoration, deterministic candidate validation and capability-aware render decisions. The benchmark measures the protection and validation path under serial test execution.

---

## 2. FILES

| File | Coverage |
|---|---|
| `helpers.ts` | Shared fidelity input and protected-document builders |
| `performance.test.ts` | Fidelity pipeline latency benchmark |
| `protected-spans.test.ts` | Markdown span detection, encoding and restoration |
| `render.test.ts` | Render modes plus fidelity and render telemetry |
| `validator.test.ts` | Structural, semantic, refusal and terminal-state validation |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/fidelity
```

Expected result: all fidelity and render tests pass.

---

## 4. RELATED

- [Fidelity subsystem](../../src/fidelity/README.md)
- [Render subsystem](../../src/render/README.md)
