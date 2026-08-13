# T001 — Confirm-First Disposition

Re-graded every requirement (spec.md REQ-001..REQ-011) and checklist item against live
code at the worktree's origin tip (`0bf6aa7957`), before writing anything. Evidence is
grep/read output from `.opencode/skills/system-deep-loop/runtime/lib/`, not assumption.

## Ground truth found in live code

- No `cutover_certificate` (or any "cutover" ledger event) exists anywhere in `lib/`
  (`grep -rl "cutover_certificate" lib/` → no hits). Siblings `001-inflight-state-migration`
  and `002-per-mode-authority-flip` are still doc-only (Planned; no `implementation-summary.md`,
  no runtime code) — this program has not built any 014 runtime yet.
- `authorized-ledger/append-only-ledger.ts` hard-privatized `#appendAuthorized`; the only
  callable seam is `invokeAppendAuthorized` (module-private bridge) or the ergonomic wrapper
  `locks-and-fencing/fenced-ledger-writer.ts::appendAuthorizedThroughFence(ledger, event, proof)`,
  which acquires a fence, calls the bridge, and releases it. This is the seam this child must use.
- `deep-ai-council-rollback-gate/rollback-switch.ts` defines `ALLOWED_AUTHORITY_STATES` and the
  full `AuthorityState` vocabulary (`legacy_authoritative | shadowing | cutover_ready |
  new_authoritative_reversible | rollback_pending | new_authoritative_final`) — reused as-is,
  not redefined.
- Each of the 8 "013 columns" (`agent-improvement`, `deep-ai-council`, `deep-alignment`,
  `deep-improvement-common`, `deep-research`, `deep-review`, `model-benchmark`,
  `skill-benchmark`) already has its own `<mode>-rollback-gate/mode-gate.ts` producing a
  `<Mode>ModeMigrationCertificate` (`readiness: 'ready-for-phase-014-consideration'`,
  `authorityState: 'legacy_authoritative'`, `authorityMutation: false`,
  `cutoverCertificate: false`) — this is the "mode gate" evidence input this child's certificate
  must reference by digest, not rebuild.
- Each of those 8 gates *also* already contains a pure, exported
  `evaluate<Mode>RollbackWindow(input)` implementing the exact phase-004 14-day/5-run
  "later-of" rule (with a graph-based double-count guard for shared execution/certificate
  identity). This proves the algorithm but is duplicated 8x as a **pre-cutover readiness**
  helper (it is fed into the mode-gate's `rollback_readiness` disposition, always under
  `authority.state === 'legacy_authoritative'`), not a persisted **post-cutover** window
  record opened at a real CAS. No such persisted window record exists anywhere.
- `<mode>-rollback-gate/rollback-switch.ts` (`requestRollback`) already implements the full
  non-destructive revert mechanics — freeze admissions, fence the writer, gateway-authorize,
  restore `legacy_authoritative` at `epoch+1`, reject any `destructiveIntent !== 'none'` or a
  retained-count delta, and emit a signed rollback certificate — generically over any
  `ALLOWED_AUTHORITY_STATES` value, **including** `new_authoritative_reversible`. This is
  REFUTED as new work: the revert *executor* is already built (8x, per mode). What is missing
  is the *decision* layer (when to trigger it) and the window bookkeeping around it.
- `inflight-state-classification/phase-014-classification-gate.ts` already exists
  (`createPhase014HandlingPlan`, `evaluateModeCutoverReadiness`,
  `verifyPhase014HandlingPlan`) — explicitly documented as "Assess readiness only; this
  function cannot issue a certificate or move authority." This is upstream evidence (phase
  008/001 territory) to reference by digest, not to duplicate.
- `mode-gate.ts`'s own `rollback_readiness` disposition binds the classification manifest via
  `verifyClassificationManifest(manifest)` (mode-agnostic integrity check only, no per-mode
  `WorkflowMode` scoping) identically across all 8 modes — including
  `deep-improvement-common`, which has **no** corresponding `WorkflowMode` literal (that type
  has 7 short-form values: `research | review | ai-council | agent-improvement |
  model-benchmark | skill-benchmark | alignment`; `deep-improvement-common` is absent). This
  child follows the same manifest-level (not `WorkflowMode`-scoped) binding for classification
  evidence, matching the proven pattern exactly instead of inventing an 8th `WorkflowMode`
  value that does not exist upstream.
- `receipts-and-effect-recovery` (phase 007) already defines `BoundaryReceiptPayload`,
  `CertificationEnvelope`, `CertificationProfile`, `ReceiptCertificationProvider`, and
  `createHmacCertificationProvider` — the "durable receipts, certification metadata" spec.md
  says this child "must consume rather than replace." Reused for migration-receipt evidence
  binding and for signing closure evidence; not reimplemented.
- `mixed-version-fixtures` (phase 008) already defines `MixedVersionOracleResult`
  (`MixedVersionOraclePass`/`Failure`) with `evidenceDigest`/`certificateEligible` — reused for
  the mixed-version-replay evidence binding.
- `authorized-ledger/transition-policy-registry.ts` (`TransitionPolicyRegistry`,
  `RegisteredTransitionPolicy.digest`) is the existing "approving policy" identity source —
  reused, not redefined.
- `certificate-binding-core/certificate-binding-core.ts` (`firstBoundFieldMismatch`) is the
  existing shared digest-comparison primitive for "emitted vs re-derived" field binding —
  reused for evidence-binding checks instead of a bespoke comparator.

## Per-requirement disposition

| Req | Verdict | Basis |
|-----|---------|-------|
| REQ-001 | CONFIRMED-REAL — build | No `cutover_certificate` event exists. |
| REQ-002 | CONFIRMED-REAL — build (new binder over existing verified evidence types) | No unified evidence bundle exists; per-mode gates verify subsets individually. |
| REQ-003 | CONFIRMED-REAL — build, reusing `certificate-binding-core` | No cutover-specific binding logic exists; the digest-compare *primitive* it should use already does. |
| REQ-004 | CONFIRMED-REAL — build (register one event type + append via existing seam) | Ledger/gateway/fence seam exists and is reused as-is; no event type is registered for this event. |
| REQ-005 | CONFIRMED-REAL — build a persisted window-record type/opener | No post-cutover window record exists; only a pre-cutover pure readiness evaluator does. |
| REQ-006 | CONFIRMED-REAL — build as one shared/generalized evaluator | The later-of algorithm is proven correct 8x but not exposed as a single canonical, mode-generic implementation; this child is the natural owner. |
| REQ-007 | CONFIRMED-REAL — build | No unified signal-family (health/parity/replay/authorization/receipt/budget/reconciliation) decision contract exists; only generic `HealthAggregate` exists as one input type, reused not rebuilt. |
| REQ-008 | PARTIALLY REFUTED — build only the decision/record layer | The freeze/fence/reconcile/restore/rollback-certificate *executor* already exists per mode (`rollback-switch.ts`). Reimplementing it would duplicate proven, tested mechanics and blur the ownership boundary this spec's own risk register calls out. This child instead builds the signal-driven revert *decision* and a record that binds to whichever per-mode rollback certificate executed the mechanics. |
| REQ-009 | CONFIRMED-REAL — build, signing via existing `ReceiptCertificationProvider` | No closure-evidence type exists; the certification primitive it should be signed with already does. |
| REQ-010 | CONFIRMED-REAL — build (fail-closed checks in the new binder/window code) | No cutover-specific single-mode/single-writer check exists yet. |
| REQ-011 | Structural — enforced by scope discipline in the build, not a code artifact | Ownership boundary is honored by *not* rebuilding phase 008/001/007 evidence or sibling 002/013's mechanics. |

## Built (this task)

`lib/cutover-certificate/` (types, certificate assembly/verification/ledger-registration/append,
rollback-window open/evaluate/monitor/revert-decision/close) plus `tests/unit/cutover-certificate.vitest.ts`.
Nothing in `lib/cutover-certificate/` is imported by any other runtime module — dark and additive,
consistent with the task's constraint that this child does not itself move authority.

## Explicitly NOT built (would be fabrication or duplication)

- No re-verification of shadow-parity/rollback-drill/mixed-version-replay cryptographic
  signatures (phase 008's job; this child binds their already-computed digests).
- No re-implementation of the per-mode freeze/fence/reconcile/restore/rollback-certificate
  mechanics (`<mode>-rollback-gate/rollback-switch.ts` already does this, 8x, tested).
- No per-mode duplication of the later-of window-evaluation algorithm (built once, generically,
  here).
- No touching of sibling `002-per-mode-authority-flip` (not built; out of this child's scope)
  or any live authority state.
