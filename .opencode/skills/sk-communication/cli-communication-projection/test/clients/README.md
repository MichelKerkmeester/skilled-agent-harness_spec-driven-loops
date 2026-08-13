# Client Presentation Tests

## 1. OVERVIEW

`test/clients/` verifies client-owned display commits, sidecar presentation and the presentation contract. The suites confirm failed commits and unsupported ownership return the exact-original application.

---

## 2. FILES

| File | Coverage |
|---|---|
| `display.test.ts` | Atomic replacement, append degradation and display commit failure |
| `sidecar.test.ts` | Sidecar eligibility, successful presentation and commit failure |
| `types.test.ts` | Ownership claims, reason codes and presentation result contracts |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/clients
```

Expected result: all client presentation tests pass.

---

## 4. RELATED

- [Clients subsystem](../../src/clients/README.md)
- [Package README](../../README.md)
