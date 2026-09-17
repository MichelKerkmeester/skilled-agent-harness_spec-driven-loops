# Compatibility Doctor Tests

## 1. OVERVIEW

`test/doctor/` verifies each compatibility check and the combined doctor decision. The suites cover ready, degraded, blocked and malformed-input paths with injected reachability probes.

---

## 2. FILES

| File | Coverage |
|---|---|
| `checks.test.ts` | Version, capability, reachability, credential, privacy and presentation checks |
| `doctor.test.ts` | Report aggregation, route selection and content-free output |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/doctor
```

Expected result: all compatibility doctor tests pass.

---

## 4. RELATED

- [Doctor subsystem](../../src/doctor/README.md)
- [Configuration reference](../../docs/configuration.md)
