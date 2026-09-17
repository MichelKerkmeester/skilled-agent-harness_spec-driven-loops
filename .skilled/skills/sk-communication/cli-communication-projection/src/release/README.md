# Release: Readiness, Support and Rollback

## 1. OVERVIEW

`release/` combines dated evidence into fail-closed release decisions. It publishes the support matrix, checks hosted privacy freshness and creates a deterministic rollback plan that keeps the canonical transcript unchanged.

Release readiness requires fresh provider, runtime, fidelity, privacy, evaluation, doctor and strict-validation evidence.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `evidence.ts` | Defines evidence manifests, statuses and abort reason codes |
| `index.ts` | Exposes release APIs and types |
| `release-gate.ts` | Implements `evaluateReleaseReadiness` |
| `rollback.ts` | Defines `OriginalOnlyEmergencyMode` and `planRollback` |
| `support-matrix.ts` | Builds the dated matrix and evaluates freshness |
| `types.ts` | Defines matrix rows, dimensions, status and freshness results |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `SUPPORT_MATRIX_VERSION`, `SupportMatrix`, `createSupportMatrix`, `assessSupportMatrixFreshness`, `assessOpenCodeGoHostedPrivacyFreshness`, `evaluateReleaseReadiness`, `OriginalOnlyEmergencyMode`, `planRollback` and `ReleaseAbortReasonCodes`. It also exports support, evidence, readiness and rollback types.

---

## 4. VALIDATION

```bash
npm test -- test/release
```

Expected result: package export, rehearsal, readiness, rollback and support matrix tests pass.

---

## 5. RELATED

- [Release runbook](../../docs/runbook.md)
- [Rollback reference](../../docs/rollback.md)
- [Support matrix reference](../../docs/support-matrix.md)
