# Observability Tests

## 1. OVERVIEW

`test/observability/` verifies content-free lifecycle aggregation, rotating correlation digests, telemetry export controls and redaction canary scanning. The suites confirm exports reject sensitive markers and disabled telemetry remains empty.

---

## 2. FILES

| File | Coverage |
|---|---|
| `aggregation.test.ts` | Counters and rates by runtime and presentation tier |
| `correlation.test.ts` | Key rotation, digest stability and unlinkability |
| `export.test.ts` | Enabled, disabled and rejected telemetry exports |
| `redaction.test.ts` | Canary detection and leak assertions |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/observability
```

Expected result: all observability tests pass.

---

## 4. RELATED

- [Observability subsystem](../../src/observability/README.md)
- [Release subsystem](../../src/release/README.md)
