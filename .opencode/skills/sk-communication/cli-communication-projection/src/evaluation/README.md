# Evaluation: Blinded Release Evidence

## 1. OVERVIEW

`evaluation/` builds reproducible, content-free evidence for projection release decisions. It freezes the corpus and pre-registration, masks paired presentations, calculates powered sample sizes, applies fidelity vetoes and evaluates non-inferiority without pooling presentation tiers.

The subsystem produces release-gate decisions and reports. Proxy reviewers remain provisional and cannot certify a release.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `baselines.ts` | Declares explicit baseline placeholders |
| `blinding.ts` | Builds and verifies masked review packets |
| `corpus.ts` | Loads and verifies the evaluation corpus |
| `fidelity-veto.ts` | Converts absolute fidelity failures into veto decisions |
| `gate.ts` | Evaluates stratified non-inferiority release gates |
| `index.ts` | Exposes evaluation APIs and types |
| `noninferiority.ts` | Calculates paired confidence intervals and decisions |
| `pilot.ts` | Runs the variance pilot |
| `power.ts` | Calculates paired-rating sample sizes |
| `preregistration.ts` | Freezes and verifies evaluation plans |
| `proxy-judge.ts` | Runs provenance-labeled proxy reviewers |
| `report.ts` | Creates deterministic stratified release reports |
| `run-manifest.ts` | Creates reproducible run metadata |
| `types.ts` | Defines corpus, pilot, evidence and run contracts |

---

## 3. PUBLIC EXPORTS

The barrel exports corpus constants and loaders, masked review helpers, `runVariancePilot`, `calculatePoweredSampleSize`, pre-registration helpers, proxy reviewer helpers, fidelity veto evaluators, `evaluateDimensionNonInferiority`, `evaluateReleaseGate`, `createReleaseReport`, `createRunManifest` and `assertHumanCertifiable`.

It also exports the input, evidence, decision, report and manifest types used by those APIs.

---

## 4. VALIDATION

```bash
npm test -- test/evaluation
```

Expected result: corpus, blinding, statistics, gate, report and integration tests pass.

---

## 5. RELATED

- [Release subsystem](../release/README.md)
- [Source map](../README.md)
