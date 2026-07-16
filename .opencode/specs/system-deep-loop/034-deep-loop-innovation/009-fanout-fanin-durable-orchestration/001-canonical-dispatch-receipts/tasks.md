---
title: "Tasks: Canonical Dispatch Receipts"
description: "Tasks for canonical pre-spawn dispatch receipts, durable invocation fingerprints, and resume-time duplicate detection."
trigger_phrases:
  - "canonical dispatch receipts tasks"
  - "pre-spawn receipt tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created implementation tasks for canonical dispatch receipts"
    next_safe_action: "Start with the event schema and idempotent ledger append"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Canonical Dispatch Receipts

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

- [ ] T001 Pin phase-005 adapter/fingerprint fixtures and phase-006/004 interface versions
- [ ] T002 Inventory manifest resolution, pool-worker invocation, and subprocess spawn boundaries
- [ ] T003 Define the `lineage_dispatch_resolved` registry entry, field allowlist, identity derivation, and typed errors
- [ ] T004 Capture legacy command, manifest, pool, retry, budget, checkpoint, and artifact baselines
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the canonical dispatch-receipt schema and post-validation event builder
- [ ] T006 Persist the exact phase-005 `invocationFingerprint` with version/algorithm metadata and normalized-fact checks
- [ ] T007 Add stable receipt, dispatch, run, leaf/logical-branch, attempt, causality, and idempotency identities
- [ ] T008 Add safe prompt/input/config digests and reject raw prompts, credentials, environment values, and run-master secrets
- [ ] T009 Integrate `receipt-crypto.ts` canonicalization and MAC primitives with explicit advisory/durable verifier labeling
- [ ] T010 Require transition authorization and a durable phase-006 append receipt before crossing the pool/spawn boundary
- [ ] T011 Implement exact-repeat append reuse and same-identity/different-facts conflict rejection
- [ ] T012 Build the verified dispatch-receipt projection and resume state classifier
- [ ] T013 Emit unresolved handoff data for receipt-without-result cases without implementing successor result/salvage logic
- [ ] T014 Wire additive-dark emission/comparison while preserving legacy authority and behavior
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify: Every leaf spawn has an earlier durable authorized receipt and ledger append evidence
- [ ] T016 Verify: Receipt facts cover executor kind, model, effort, search policy, executable/adapter versions, safe digests, and exact fingerprint
- [ ] T017 Verify: Capability, authorization, append, and fsync failures invoke neither the pool worker nor spawn stub
- [ ] T018 Verify: Exact retries return the original sequence/hash receipt; changed facts under one identity fail closed
- [ ] T019 Verify: Canonicalization/MAC vectors are stable, tampering fails, and process-local evidence is not accepted as restart authority
- [ ] T020 Verify: Secret-injection fixtures leave no raw credential, prompt, environment, or run-master-secret material in events or logs
- [ ] T021 Verify: Resume rebuilds never-dispatched, already-resolved, result-recorded, unresolved, conflict, and corrupt states from ledger evidence
- [ ] T022 Verify: Receipt-only leaves enter recovery/salvage coordination and are neither completed nor blindly respawned
- [ ] T023 Verify: Crash cuts before append, after append/before spawn, during spawn, and after exit/before result are deterministic and duplicate-safe
- [ ] T024 Verify: Legacy phase-005 command, manifest, pool, retry, budget, checkpoint, and persisted-artifact baselines remain unchanged
- [ ] T025 Run strict spec validation and the targeted runtime build/typecheck/unit suite with non-zero discovery assertions
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
