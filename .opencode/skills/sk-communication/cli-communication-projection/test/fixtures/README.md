# Shared Test Fixtures

## 1. OVERVIEW

`test/fixtures/` stores deterministic, content-free inputs for contract, evaluation, provider and runtime suites. Fixture consumers validate provenance and integrity before using the records.

The folder contains data rather than standalone Vitest files, so the package test command exercises it through its consumers.

---

## 2. FILES

| File | Coverage |
|---|---|
| `context-cases.json` | Bounded context selection cases |
| `evidence-cases.json` | Telemetry and evaluation evidence cases |
| `exact-originals.json` | Exact-original encoding and digest cases |
| `outcome-cases.json` | Projection and error outcome cases |
| `prompt-profiles.json` | Prompt profile and control mapping cases |
| `provider-cases.json` | Provider record and routing cases |
| `reference-evaluation.json` | Reference evaluation inputs |
| `runtime-matrix.json` | Six-runtime capability and event fixtures |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test
```

Expected result: every fixture consumer and the full test suite pass.

---

## 4. RELATED

- [Contract tests](../contracts/README.md)
- [Runtime tests](../runtimes/README.md)
