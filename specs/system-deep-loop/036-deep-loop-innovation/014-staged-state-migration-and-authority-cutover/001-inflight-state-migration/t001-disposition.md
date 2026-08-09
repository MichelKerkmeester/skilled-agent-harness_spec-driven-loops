# T001 — Confirm-First Disposition

Re-graded every requirement (spec.md REQ-001..REQ-011) and checklist item against live code at
this worktree's HEAD (`a9da24cf4c`), before writing anything. Evidence is grep/read output from
`.opencode/skills/system-deep-loop/runtime/lib/`, not assumption.

## Ground truth found in live code

- No `lib/inflight-state-migration/` directory, no coordinator, no migration receipt shape, and no
  checkpoint-import ledger event existed anywhere in the runtime before this task
  (`find . -iname '*inflight-state-migration*' -o -iname '*migration-coordinator*'` → no hits).
  Sibling `003-cutover-certificate-and-rollback-window` is already built and landed; sibling
  `002-per-mode-authority-flip` remains doc-only (Planned). This child had zero prior runtime code.
- `inflight-state-classification/phase-014-classification-gate.ts` already exists
  (`createPhase014HandlingPlan`, `verifyPhase014HandlingPlan`, `classificationFreshnessDigest`,
  `isClassificationEvidence`) and is explicitly documented as read-only readiness assessment —
  reused as the freshness-recheck substrate, not duplicated. Its `classificationFreshnessDigest`
  covers state digest, shape, schema, authority epoch, lease, and pending-effect fields but **not**
  the disposition proof or verifier fields — this child's `evidenceMatchesFrozenRow` closes that
  gap by independently rebinding `proofDigest`, `verifierReceiptDigest`, `replayFingerprintDigest`,
  `rollbackScenarioDigest`, and `parityCaseDigest` before any live operation runs.
- `locks-and-fencing/fenced-lease-coordinator.ts` (`FencedLeaseCoordinator`) already provides the
  durable monotonic fence, takeover-on-expiry, and `withFence`/`withFences` guarded-commit
  primitive — reused directly via the `ProtectedResourceKinds.WRITER` kind (the same kind already
  used for `loop-lock-owner` and `cli-graph-writer`, per `protected-resource-registry.ts`'s shipped
  manifest) rather than inventing a new protected-resource kind for this dark coordinator.
- `authorized-ledger/append-only-ledger.ts` hard-privatized `#appendAuthorized`; the only callable
  seam is `locks-and-fencing/fenced-ledger-writer.ts::appendAuthorizedThroughFence(ledger, event,
  proof)`. This child's `MIGRATE` executor uses that exact helper — no public append was added, and
  no cast reaches the private method. `#appendAuthorized`'s own exact-retry idempotency (same
  `event_id` + same canonical bytes + same decision returns the existing durable receipt instead of
  erroring) is the mechanism this child's crash-resume design for `MIGRATE` relies on and does not
  reimplement.
- `deep-loop/atomic-state.ts` supplies `computeIntegrityHash` (SHA-256, `sha256:`-prefixed digest)
  and `verifyIntegrity` (warning-only on mismatch). The task brief cited line ranges `:210-213` /
  `:242-259` / `:483-500`; live code at HEAD has these functions at `:360-363` / `:392-410` /
  `:635-652` respectively — the functions and their exact contracts are unchanged, only line numbers
  drifted since the plan was authored. This child wraps both with a hard-fail interpretation
  (`assertBundleMatchesDigest`, `assertStampedIntegrity` in `migration-integrity.ts`) rather than
  reimplementing the hashing algorithm.
- `receipts-and-effect-recovery` and `locks-and-fencing/fenced-state-store.ts` were evaluated and
  **not** reused for the disposition artifacts: `FencedStateStore.replace` requires a
  `MUTABLE_RESOURCE_KINDS` member (`COUNCIL_ROUND`, `FANOUT_STATUS`, `LINEAGE_STATE`,
  `MERGE_TARGET`, `PAUSE_RESUME`, `PROJECTION`, `WAIT_CHECKPOINT`) and its own CAS-versioned
  single-resource-per-file model, neither of which fits a per-row migration receipt keyed by
  `(manifestDigest, rowId)`; `BoundaryReceiptIssuer` requires a full `AuthorizedEvidenceWriter` +
  `TransitionAuthorizationGateway` binding per receipt, which this dark, additive coordinator does
  not own. This child's own receipt store (`writeCanonicalJsonAtomic` under
  `FencedLeaseCoordinator.withFence`) is the smallest correct primitive that still uses only
  already-existing durable-write helpers (`locks-and-fencing/durable-file.ts`, already reached
  directly by `lib/legacy-projections/shadow-projection-store.ts` from outside `locks-and-fencing/`
  — the same deep-import pattern this child follows).

## Per-requirement disposition

| Req | Verdict | Basis |
|-----|---------|-------|
| REQ-001 | CONFIRMED-REAL — build | No migration coordinator or receipt store existed; nothing to reuse for row/receipt closure. |
| REQ-002 | CONFIRMED-REAL — build (extends existing freshness substrate) | `classificationFreshnessDigest` exists but does not cover proof/verifier fields; this child's `evidenceMatchesFrozenRow` is new. |
| REQ-003 | CONFIRMED-REAL — build | No `UPCAST` executor existed; the disposition proof shape it consumes already exists (phase-008), reused not redefined. |
| REQ-004 | CONFIRMED-REAL — build | No `FORK` executor or dark-namespace artifact writer existed. |
| REQ-005 | CONFIRMED-REAL — build | No checkpoint-import event type, no `MIGRATE` executor; the fenced append seam it must use already exists and is reused unmodified. |
| REQ-006 | CONFIRMED-REAL — build | No `PIN`/`BLOCK` executors existed. |
| REQ-007 | CONFIRMED-REAL — build (consumes existing fence, does not reimplement it) | `FencedLeaseCoordinator` already exists; no caller in this runtime used it for a per-row migration resource before this task. |
| REQ-008 | CONFIRMED-REAL — build | No receipt store, commit-marker, or resumable coordinator existed anywhere. |
| REQ-009 | CONFIRMED-REAL — build (wraps existing hash primitive) | `computeIntegrityHash`/`verifyIntegrity` exist but are warning-only; this child's hard-fail wrapper did not exist. |
| REQ-010 | CONFIRMED-REAL — build | No abort/rollback receipt path existed for this domain. |
| REQ-011 | CONFIRMED-REAL — build | No successor handoff manifest existed for phase-014's migration outcome. |

No requirement was found ALREADY-PRESENT or REFUTED; this child had no prior runtime surface to
duplicate or contradict.

## Built (this task)

`lib/inflight-state-migration/` (`migration-types.ts`, `migration-envelope.ts`,
`migration-integrity.ts`, `migration-dispositions.ts`, `migration-coordinator.ts`,
`migration-handoff.ts`, `index.ts`) plus `tests/unit/inflight-state-migration.vitest.ts` (31 cases).
Nothing in `lib/inflight-state-migration/` is imported by any other runtime module — dark and
additive. No authority state, legacy writer, or successor sibling's scope was touched.

## Explicitly NOT built (would be fabrication or duplication)

- No re-implementation of `FencedLeaseCoordinator`'s lease/fence/takeover mechanics.
- No new `ProtectedResourceKind`; the existing `WRITER` kind covers this coordinator's
  bookkeeping-mutation shape exactly as it already does for the loop lock and CLI graph writer.
- No re-implementation of `#appendAuthorized`'s exact-retry idempotency or of
  `TransitionAuthorizationGateway`'s authorization/audit chain; `MIGRATE` consumes both through the
  existing `appendAuthorizedThroughFence` seam and a caller-supplied `GatewayAllowProof`.
- No reclassification logic and no invented disposition proof fields; phase-008's classifier and
  disposition-proof types are consumed by digest, never recomputed or widened.
- No touching of sibling `002-per-mode-authority-flip`, any authority-state transition, or any
  legacy-writer retirement path.
