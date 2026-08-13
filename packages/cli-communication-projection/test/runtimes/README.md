# Runtime Adapter Tests

## 1. OVERVIEW

`test/runtimes/` verifies the six runtime adapters, shared conformance rules, capability mapping, pinned fixture replay and tier-stratified smoke behavior. It also covers malformed and unknown events, telemetry path sanitization and adapter overhead.

---

## 2. FILES

| File | Coverage |
|---|---|
| `capability.test.ts` | Capability evidence and version compatibility |
| `claude.test.ts` | Claude event mapping and presentation |
| `codex.test.ts` | Codex event mapping and presentation |
| `conformance.test.ts` | Shared adapter conformance runner |
| `cursor.test.ts` | Cursor event mapping and presentation |
| `devin.test.ts` | Devin event mapping and presentation |
| `edge-cases.test.ts` | Unknown, malformed, cancelled and incompatible inputs |
| `fixtures.test.ts` | Pinned runtime fixture replay |
| `helpers.ts` | Shared runtime envelope and capability builders |
| `matrix.test.ts` | Capability matrix construction and resolution |
| `opencode.test.ts` | OpenCode event mapping and presentation |
| `performance.test.ts` | Runtime adapter overhead benchmark |
| `pi.test.ts` | Pi event mapping and synchronous presentation |
| `replay-helpers.ts` | Fixture replay and canonical-state assertions |
| `smoke.test.ts` | Tier-stratified six-runtime smoke suite |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/runtimes
```

Expected result: all runtime adapter tests pass.

---

## 4. RELATED

- [Runtimes subsystem](../../src/runtimes/README.md)
- [Fixture data](../fixtures/README.md)
