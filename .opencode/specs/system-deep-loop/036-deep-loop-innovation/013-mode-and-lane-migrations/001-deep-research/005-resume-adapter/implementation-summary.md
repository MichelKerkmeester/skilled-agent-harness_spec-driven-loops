---
title: "Implementation Summary: Deep Research Resume Adapter"
description: "Delivered a closed additive-dark resume contract that rebuilds Deep Research state from the authenticated ledger, persists one fail-closed decision, and exposes parity-ready continuity evidence."
trigger_phrases:
  - "deep research resume adapter implementation"
  - "deep-research resume decision"
  - "deep research continuity projection"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-22T08:22:35Z"
    last_updated_by: "codex"
    recent_action: "Bound effect confirmations to canonical intent evidence"
    next_safe_action: "Sibling 006-shadow-parity can consume the closed decision and continuity projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-resume-adapter.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-resume-adapter-20260722"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Authenticated ledger tail tracking, not a caller cursor, owns reducer sourceTailSequence"
      - "Unknown replay fingerprint versions block through the shared version registry"
      - "Effect history comes from verified effect events, never receipt-declared attempt identifiers"
      - "Same-run resume preserves the persisted lease identity because no shared RunLease class is exported"
      - "Only explicit reexecute branch decisions enter the optional dark execution pool"
      - "Reopened or restarted branches with live reservation references compensate before reexecution"
      - "Effect confirmations must pass the frozen seven-fact intent binding helper"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-resume-adapter |
| **Completed** | 2026-07-22 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; legacy state, writers, and authority remain unchanged |
| **Candidate SHA** | `012652b479dee08455de574574c5e7a8971a8b0b` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Research now has a closed resume boundary over the four landed golden sibling contracts. The adapter reads the real
verified ledger, derives its authenticated stream tail, folds the exact ledger events through
`foldDeepResearchEvents`, verifies supplied checkpoints and sealed references, classifies persisted replay compatibility,
and appends one immutable `run_resumed` event before any optional dark branch dispatch.

### Closed resume and parity contract

`DeepResearchResumeDecision` is the immutable recovery output. It contains exact per-component compatibility decisions,
one disposition per logical branch and effect, dependency-closed invalidation, the unchanged persisted lease, verified
artifact and forensic receipt digests, and an integrity digest over the whole closed body. `DeepResearchContinuityProjection`
maps initialization, plan/frontier, gather/analyze, convergence, synthesis, memory-save, and terminal state to reducer-owned
fields. Both records reject unknown keys and validate identifiers, versions, references, digests, counts, enums, and reason
text by semantic kind. Downstream consumers must not widen these records back to open JSON.

The adapter derives `sourceTailSequence` from verified ledger frames and requires exact contiguous stream sequence. A caller
checkpoint can bound replay only after the adapter reconstructs and hashes the authenticated prefix itself. The immutable
decision is authorized and appended through `TransitionAuthorizationGateway` and `AppendOnlyLedger`; repeating the exact
request reuses the original semantic event and performs no second dispatch.

### Compatibility, effects, and drift

Persisted fingerprint versions resolve through the shared `FingerprintVersionRegistry`. Manifest, reducer, adapter, schema,
codec, and policy versions each receive `exact`, `compatible`, `migrate`, `pin-old-runtime`, or `blocked`; an absent rule or
unknown fingerprint version blocks. Changed manifests take an explicit restart or reject path with manifest-scoped retry keys.
A restarted or dependency-reopened branch carrying a projected reservation reference now emits `compensate`, retains a null
attempt ID, and stays outside the execution pool until that external reservation is addressed; only reservation-safe
`reexecute` decisions receive fresh attempt identities.

Effect recovery rebuilds the shared effect projection and reads verified intent, confirmation, recovery, reconciliation,
conflict, and operator-resolution events. Confirmations are trusted only when `effectConfirmationBindsIntent` verifies the
derived confirmation identity, effect identity, exact intent event ID and stored digest, idempotency key, adapter digest,
and expected postcondition digest. Recovery chains additionally match the canonical intent digest; reconciliation and
conflict links remain grounded in gateway-authorized ledger event identities. Transition receipt `attemptIds` remain
forensic metadata only. An unresolved irreversible effect with no conclusive reconciliation capability blocks and never
auto-retries. Source drift follows the frozen projection's source, evidence, claim, relation, gap, and branch edges so only
reachable work reopens while prior revisions remain readable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-resume-adapter/types.ts` | Created | Closed request, decision algebra, continuity, execution-pool, and result contracts |
| `runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts` | Created | Authenticated reconstruction, compatibility, recovery, invalidation, append, and dark dispatch |
| `runtime/lib/deep-research-resume-adapter/index.ts` | Created | Stable exports for shadow parity and rollback consumers |
| `runtime/tests/unit/deep-research-resume-adapter.vitest.ts` | Created | Twenty-one real-substrate confirmation, reconciliation, conflict, rejection, drift, compensation, idempotency, and dark-authority fixtures |
| `decision-record.md` | Created | Canonical effect-evidence trust decision and intentional effect-compensation unreachability |
| Leaf packet docs | Updated | Completion state, resolved substrate questions, evidence map, and sibling handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is new and dark by default. `enableDarkDispatch` is optional and defaults off; every result states
`dark-evidence-only`, `shadow-only`, `legacyAuthority: unchanged`, and `productionCompletion: false`. No legacy reader,
writer, state file, sibling module, authority switch, or production completion path was changed.

Tests drive `AppendOnlyLedger`, `TransitionAuthorizationGateway`, the frozen Deep Research reducer, the shared sealed store,
the shared replay registry, the effect-event reducer, and the real transition receipt parser. A deliberate guard-deletion
check made the unknown-version fixture fail with `exact` instead of `blocked`, then the guard was restored and the complete
suite returned green. A second mutation falsifier restored the vulnerable bare `effect_id` match and made the forged
confirmation case fail with `reconcile` instead of `blocked`; restoring `effectConfirmationBindsIntent` returned the suite
to green. Added effect fixtures prove genuine confirmation reconciliation, applied reconciliation recovery, fail-closed
`in_doubt` and `conflict` verdicts, replay-safe `not_applied` reexecution, and immutable conflict blocking. Existing negative
fixtures continue to prove that an unregistered manifest pair blocks and rejects, divergent content under one idempotency
key is denied by the real gateway with `idempotency_conflict`, and a reopened live reservation is compensated before it can
reach branch dispatch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Authenticate the tail independently of reducer input | The frozen reducer accepts caller-supplied `sourceTailSequence` on a genesis fold, so the adapter must bind it to real verified frames |
| Ignore receipt-declared attempt IDs as execution proof | The certificate verifies those IDs self-referentially; effect events are the grounded execution record |
| Bind confirmations through the frozen substrate helper | A bare effect identity proves one of seven committed facts and can certify a forged applied outcome |
| Represent the persisted lease as a closed value contract | The shared runtime exports no `RunLease` class; fail-closed equality to folded run, lineage, generation, and replay identity prevents silent minting |
| Compensate live branch reservations before retry | The projection retains the reservation reference but exposes no released state, so restart or dependency reopen cannot safely allocate a fresh attempt or enter the execution pool |
| Block unresolved irreversible effects | The shared adapter descriptor exposes reconciliation and replay safety but no compensation executor |
| Keep dispatch optional and dark | The next siblings own parity, rollback, and cutover; this leaf only emits evidence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Real substrate imports | PASS, `substrateImportsReal: true`; the suite imports the production ledger, gateway, reducer, artifact store, replay registry, and effect writer |
| Target Vitest suite | PASS, 1 file and 21 tests, up from the 14-test baseline |
| Forged effect confirmation | PASS, non-binding intent and postcondition digests yield `blocked`; bare-match mutation flips the result to `reconcile` and fails the test |
| Genuine effect confirmation | PASS, the seven-fact binding helper returns true and the decision yields `reconcile` |
| Reconciliation and conflict branches | PASS, `applied` reconciles, `in_doubt` and `conflict` block, replay-safe `not_applied` reexecutes, and immutable conflict blocks |
| Reservation compensation | PASS, reopened live reservation yields `compensate`, null attempt ID, no pool entry, and no dispatch |
| Unregistered manifest | PASS, absent compatibility rule yields `blocked` plus manifest `reject` |
| Divergent idempotency content | PASS, second request denied by the real gateway with `idempotency_conflict` |
| Unknown-version guard-deletion check | PASS, targeted test failed as expected with `exact` instead of `blocked` |
| Runtime TypeScript compile | PASS, exit 0 |
| Strict packet validation | PASS, exit 0 with Errors 0 and Warnings 0 |
| Scope audit | PASS for requested paths; inherited unrelated status entries remain outside scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No exported shared `RunLease` class.** The adapter accepts a closed persisted lease record and proves its run, lineage,
   generation, and replay identity against the ledger projection. It never allocates a replacement.
2. **No shared effect compensation executor.** Effect-side `compensate` is intentionally structurally unreachable because
   the frozen descriptor has no compensation executor, intent, or verified result. Branch `compensate` remains a reachable
   handoff that prevents reexecution over a live reservation. Unresolved irreversible effects block until the substrate
   exposes an explicit executable and verifiable compensation contract; the rationale is recorded in decision-record.md
   section 7.
3. **Non-authoritative by design.** The projection and decision are evidence for shadow parity; neither can represent
   production completion before the later cutover.
<!-- /ANCHOR:limitations -->
