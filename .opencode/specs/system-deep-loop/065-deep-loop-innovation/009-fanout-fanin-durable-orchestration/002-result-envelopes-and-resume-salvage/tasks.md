---
title: "Tasks: Result Envelopes & Resume/Salvage"
description: "Tasks for typed leaf results, deterministic resume reconstruction, and provenance-preserving salvage."
trigger_phrases:
  - "result envelope resume tasks"
  - "fanout salvage implementation tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
    last_updated_at: "2026-07-15T14:42:33Z"
    last_updated_by: "codex"
    recent_action: "Sequenced result-envelope, resume-fold, salvage, and crash-test tasks"
    next_safe_action: "Start T001 by freezing receipt and ledger interfaces"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] T001 Freeze the sibling-001 dispatch-receipt join fields and phase-003 envelope/append/read interfaces
- [ ] T002 Inventory result, evidence, artifact, usage, cost, error, retry, and salvage facts emitted by the shipped fan-out scripts
- [ ] T003 Pin golden fixtures for successful, partial, failed, timed-out, cancelled, orphaned, retried, salvaged, and registry-reconstructed leaves
- [ ] T004 Define per-leaf result schemas, required evidence sets, inline-size limits, artifact references, and secret-redaction rules
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the registered result-envelope schema and canonicalizer for all terminal statuses
- [ ] T006 Implement receipt/result one-to-one pairing, exact-repeat idempotency, and changed-facts conflict rejection
- [ ] T007 Implement the pure verified-ledger resume reducer and deterministic progress-snapshot schema
- [ ] T008 Implement completed-leaf exclusion and explicit not-dispatched, in-flight, partial, failed, conflicted, and unreadable states
- [ ] T009 Implement phase-004 effect reconciliation before any unsettled attempt can become retry-eligible
- [ ] T010 [P] Implement typed stdout, state-log, iteration-artifact, and registry salvage fragment extractors
- [ ] T011 Implement append-only salvage recording and deterministic effective-result assembly without source mutation
- [ ] T012 Implement additive dark adapters at the fan-out result, salvage, and merge boundaries
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify every terminal dispatch joins to one result and every dangling, duplicate-conflict, or unknown-version pair fails closed
- [ ] T014 Verify success requires valid parsed output and required evidence rather than exit code or file presence
- [ ] T015 Verify repeated ledger folds and resumes are byte-identical and omit every completed leaf from dispatch
- [ ] T016 Verify not-applied, applied, in-doubt, and conflict effect outcomes produce the required retry/reconcile/stop decisions
- [ ] T017 Verify salvaged fragments retain source, digest, parser, scope, completeness, evidence, usage, and cost provenance
- [ ] T018 Verify identical salvage repeats deduplicate and changed fragments conflict without rewriting earlier events
- [ ] T019 Run the complete crash-injection matrix across dispatch, result, effect reconciliation, and salvage append boundaries
- [ ] T020 Shadow-compare legacy summaries, failures, recovered iterations, failed markers, reconstructed registries, attribution, and exit codes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/crash-injection/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
