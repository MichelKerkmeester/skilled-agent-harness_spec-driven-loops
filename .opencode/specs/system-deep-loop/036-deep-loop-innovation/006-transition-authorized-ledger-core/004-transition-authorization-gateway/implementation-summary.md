---
title: "Implementation Summary: Transition-Authorization Gateway"
description: "Default-deny transition authorization, typed decision audit, exact single-use allow linkage, replay verification, and dark legacy isolation."
trigger_phrases:
  - "transition authorization gateway implementation"
  - "default deny gateway verification"
  - "authorization decision replay"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the transition-authorization gateway leaf under the accepted focused co-landing gate"
    next_safe_action: "Await scoped dark-boundary integration"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Transition-Authorization Gateway

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-transition-authorization-gateway |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Candidate SHA** | `6c579941fa09d140010d9380b84babe8fcd0412a` plus the scoped dirty candidate |
| **Authority posture** | Authoritative only over dark-ledger admission; legacy runtime behavior remains authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every dark typed transition now passes one default-deny gateway before the ledger can allocate a domain sequence. The gateway records typed allow and deny decisions in a separate audit stream, binds an allow to one exact event and ledger identity, and leaves durable but unapplied allows visible after a crash instead of inventing domain history.

### Gateway Modules

| Module | Purpose |
|--------|---------|
| `transition-authorization-gateway.ts` | Canonical request validation, authority/policy evaluation, default-deny normalization, typed audit append, and allow-proof creation |
| `transition-policy-registry.ts` | Immutable policy ID/version/evaluator registry with stable implementation and policy digests |
| `authorization-decision-event.ts` | Closed `authorization.decision.recorded@1` payload contract and event registry |
| `authorization-replay.ts` | Cross-stream applied/denied/unapplied classification and policy-parity verification |
| `authorized-ledger-types.ts` | Authority snapshot, policy input/result, decision record, audit receipt, gateway result, and allow-proof types |
| `authorized-ledger-errors.ts` | Typed authorization, storage, integrity, and replay failures |
| `append-only-ledger.ts` | Under-lock proof revalidation and proof-required domain append |
| `immutable-frame-store.ts` | Separate immutable audit/domain frame storage and verified heads |
| `dark-ledger-adapter.ts` | Frozen boundary census and result-preserving dark gateway adapter |
| `deterministic-reducer.ts` | Verified-event-only projection rebuild used by replay proofs |
| `index.ts` | One public surface for the co-landed gateway and ledger unit |

### Co-Landing Invariant Proofs

| Invariant | Focused evidence |
|-----------|------------------|
| Direct append without allow is rejected | The ledger has no public proof-free append and returns `AUTHORIZATION_REQUIRED` when allow proof is absent |
| Allow linkage is exact and single-use | One durable allow unlocks its exact event once; retry reuses the receipt; another event or ledger identity is rejected |
| Deny advances only audit | Policy denial writes `authorization.decision.recorded` to audit while the domain head stays zero |
| Default deny is fail closed | Missing input, unknown policy, unsupported registry/event input, stale head/epoch, evaluator exception/timeout, authority failure, and audit failure never append a domain event |
| Hash-chain and proof integrity | Recomputed frames with unknown event type or altered authorization reference fail verified reads |
| Idempotency | Exact retry is stable and same-ID/different-content conflicts without advancing the domain head |
| Deterministic authorization replay | Replay verifies earlier allow linkage, deny absence, audit/domain ordering, policy parity, and unapplied allows |
| Torn-tail recovery | The shared ledger core preserves damaged bytes, recovers the last verified head, and resumes without rewriting authorization evidence |
| Dark legacy isolation | Gateway allow, deny, and injected ledger failure all return the exact legacy result through the reusable adapter |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gateway co-landed with the proof-required ledger under `runtime/lib/authorized-ledger/`; it was never staged as a standalone permissive writer. Finalization did not modify those core modules or any legacy writer. The accepted phase gate is the focused `authorized-ledger.vitest.ts` suite with 20 passing cases plus the invariant proofs above, run beside the envelope suite that supplies canonical events and registry identity.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record allow before domain append | A durable unapplied allow is auditable; a domain event without an earlier allow is forbidden |
| Normalize uncertainty and failure to explicit deny | Missing, stale, unknown, exceptional, timed-out, or unavailable dependencies cannot fail open |
| Separate audit and domain streams | Denial remains visible without advancing domain state or entering domain reducers |
| Revalidate allow linkage at append | A proof for another event, ledger, head, epoch, policy, or digest cannot be replayed as authority |
| Preserve exact legacy results through the dark adapter | Gateway outcomes remain shadow evidence and cannot change authoritative runtime behavior before cutover |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused authorized-ledger Vitest | PASS: 1 file, 20 tests passed, 0 failed |
| Combined envelope + authorized-ledger Vitest | PASS: recorded by the final co-landing verification command |
| Runtime TypeScript typecheck | PASS: exit 0 |
| Strict packet validation | PASS: Errors 0 |
| Dark authority check | PASS: reusable adapter preserves legacy results and existing writers are unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full runtime suite has 100 pre-existing baseline failures.** The worktree lacks the `better-sqlite3` native dependency and contains kebab-rename fixture mismatches such as `deep_review_auto.yaml` versus `deep-review-auto.yaml`. These failures exist at BASE, are outside the phase-006 write set, and remain owned by baseline hygiene and the phase-016 gate.
2. **Legacy transition boundaries are intentionally not wired here.** The frozen census and reusable adapter prove gateway isolation, but a later scoped integration phase must add live calls before shadow authorization evidence can accumulate.
3. **Policy no-I/O behavior remains a controlled-module contract.** The registry binds evaluator implementation identity and the gateway fails exceptions and timeouts closed, but JavaScript cannot prove the absence of closure-captured capabilities at runtime.
<!-- /ANCHOR:limitations -->
