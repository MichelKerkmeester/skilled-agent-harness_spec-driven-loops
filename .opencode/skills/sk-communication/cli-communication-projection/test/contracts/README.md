# Contract Tests

## 1. OVERVIEW

`test/contracts/` verifies schema compatibility, bounded context and privacy records, exact-original integrity, fixture provenance and the published package surface. It also covers runtime fixtures, content-free telemetry, blinded evaluation records and schema-validation throughput.

---

## 2. FILES

| File | Coverage |
|---|---|
| `compatibility.test.ts` | Same-major compatibility and breaking-major behavior |
| `context-prompt-provider.test.ts` | Context, privacy, prompt, provider, projection and error contracts |
| `exact-original.test.ts` | Exact-original encoding, digest and verification |
| `fixture-loader.ts` | Shared JSON fixture loading for contract suites |
| `fixture-metadata.test.ts` | Fixture provenance and metadata validation |
| `package-smoke.test.ts` | Public package exports and root import surface |
| `runtime-fixtures.test.ts` | Six-runtime fixture matrix validation |
| `telemetry-evaluation-benchmark.test.ts` | Telemetry, blinded evaluation and validation benchmark behavior |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm run test:contracts
```

Expected result: all contract suites pass.

---

## 4. RELATED

- [Contracts subsystem](../../src/contracts/README.md)
- [Fixture data](../fixtures/README.md)
