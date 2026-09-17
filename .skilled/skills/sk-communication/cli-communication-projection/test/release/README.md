# Release Tests

## 1. OVERVIEW

`test/release/` verifies the package export boundary, deterministic six-runtime rehearsal, fail-closed readiness gate, rollback planning and dated support matrix. The suites use injected transports and never require credentials or live provider access.

---

## 2. FILES

| File | Coverage |
|---|---|
| `package-exports.test.ts` | Declared package subpaths and built public symbols |
| `rehearsal.test.ts` | Six-runtime injected release rehearsal and transport spies |
| `release-gate.test.ts` | Required evidence, abort reasons and release-ready decisions |
| `rollback.test.ts` | Original-only emergency mode and immutable transcript checks |
| `support-matrix.test.ts` | Matrix contents, dates and freshness decisions |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/release
```

Expected result: all release tests pass.

---

## 4. RELATED

- [Release subsystem](../../src/release/README.md)
- [Release runbook](../../docs/runbook.md)
