# Evaluation Tests

## 1. OVERVIEW

`test/evaluation/` verifies the full blinded evaluation path. Coverage includes corpus integrity, masking, pre-registration, power analysis, variance pilots, proxy provenance, fidelity-aware non-inferiority gates and deterministic release reports.

---

## 2. FILES

| File | Coverage |
|---|---|
| `blinding.test.ts` | Masked packet construction and verification |
| `corpus.test.ts` | Secret-free corpus loading and integrity |
| `gate.test.ts` | Stratified release-gate decisions |
| `integration.test.ts` | Deterministic evaluation-to-report flow |
| `noninferiority.test.ts` | Paired confidence intervals and margin decisions |
| `pilot.test.ts` | Three-sample variance pilot |
| `power.test.ts` | Paired-rating sample plans |
| `preregistration.test.ts` | Immutable evaluation plans and stop rules |
| `proxy-judge.test.ts` | LLM proxy reviewer provenance and provisional status |
| `report.test.ts` | Stratified content-free release reports |
| `run-manifest.test.ts` | Reproducible evaluation run metadata |

---

## 3. VALIDATION

Run from the package directory.

```bash
npm test -- test/evaluation
```

Expected result: all evaluation tests pass.

---

## 4. RELATED

- [Evaluation subsystem](../../src/evaluation/README.md)
- [Fixture data](../fixtures/README.md)
