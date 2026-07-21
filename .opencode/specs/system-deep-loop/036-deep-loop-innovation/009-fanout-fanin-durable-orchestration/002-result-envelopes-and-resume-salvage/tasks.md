---
title: "Tasks: Result Envelopes & Resume/Salvage"
description: "Tasks for typed leaf results, deterministic resume reconstruction, and provenance-preserving salvage."
trigger_phrases:
  - "result envelope resume tasks"
  - "fanout salvage implementation tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
    last_updated_at: "2026-07-21T05:09:43Z"
    last_updated_by: "codex"
    recent_action: "Completed result-envelope, resume-fold, recovery-link, salvage, and parity tasks"
    next_safe_action: "Retain the additive-dark boundary until a later cutover packet"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Result Envelopes & Resume/Salvage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the sibling-001 dispatch-receipt join fields and phase-006 envelope/append/read interfaces [Evidence: `event-contracts.ts:1`]
- [x] T002 Inventory result, evidence, artifact, usage, cost, error, retry, and salvage facts emitted by the shipped fan-out scripts [Evidence: `legacy-shadow.ts:1`]
- [x] T003 Pin fixtures for successful, partial, failed, timed-out, cancelled, retried, salvaged, corrupt, and registry-reconstructed leaves [Evidence: `result-envelopes.vitest.ts:1`]
- [x] T004 Define result schemas, required digest references, inline-size limits, artifact references, and secret-exclusion rules [Evidence: `types.ts:1`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the registered result-envelope schema and canonicalizer for all terminal statuses [Evidence: `event-contracts.ts:1`]
- [x] T006 Implement receipt/result one-to-one pairing, exact-repeat idempotency, and changed-facts conflict rejection [Evidence: `recorder.ts:1`]
- [x] T007 Implement the pure verified-ledger resume reducer and deterministic progress-snapshot schema [Evidence: `resume-reducer.ts:1`]
- [x] T008 Implement completed-leaf exclusion and explicit not-dispatched, in-flight, partial, failed, conflicted, and unreadable states [Evidence: `resume-reducer.ts:1`]
- [x] T009 Implement verified phase-007 recovery linking with a correlation key bound to both the source event and target dispatch before any unsettled attempt can become retry-eligible [Evidence: `recorder.ts:1`; cross-leaf rejection fixture]
- [x] T010 [P] Implement typed stdout, state-log, iteration-artifact, registry, and future-fragment provenance contracts [Evidence: `types.ts:1`]
- [x] T011 Implement append-only salvage recording and deterministic effective-result derivation without source mutation [Evidence: `event-contracts.ts:1`]
- [x] T012 Implement the standalone additive-dark compatibility projection without modifying fan-out scripts [Evidence: `legacy-shadow.ts:1`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify every result joins to one receipt and every dangling, duplicate-conflict, or unknown-version stream fails closed [Evidence: `result-envelopes.vitest.ts:1`]
- [x] T014 Verify success requires valid parsed output and required evidence rather than exit code or file presence, including a resolver that returns a present-but-wrong digest [Evidence: `result-envelopes.vitest.ts:1`]
- [x] T015 Verify repeated ledger folds and resumes are byte-identical and omit every completed leaf from dispatch [Evidence: `result-envelopes.vitest.ts:1`]
- [x] T016 Verify not-applied, applied, in-doubt, and conflict outcomes produce the required retry/reconcile/stop decisions [Evidence: `result-envelopes.vitest.ts:1`]
- [x] T017 Verify salvaged fragments retain source, digest, parser, scope, completeness, confidence, and verdict provenance [Evidence: `result-envelopes.vitest.ts:1`]
- [x] T018 Verify identical salvage repeats deduplicate and changed fragments conflict without rewriting earlier events [Evidence: `result-envelopes.vitest.ts:1`]
- [x] T019 Inject a crash after frame fsync, recover the torn tail, and prove deterministic reconstruction of the committed prefix plus fail-closed handling of the unrecoverable tail [Evidence: `result-envelopes.vitest.ts:1`; ledger fault hook and `recoverTornTail()`]
- [x] T020 Shadow-compare failures, recovered iterations, failed markers, reconstructed registries, attribution, and exit classifications [Evidence: `result-envelopes.vitest.ts:1`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (strict validation, targeted tests, typecheck, alignment, crash fixtures, and shadow parity)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
