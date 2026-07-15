---
title: "Tasks: fan-out live-tools unblock (065/006 phase 002)"
description: "Tasks for the early dispatch-only fan-out live-tools unblock: policy, capabilities, adapters, fingerprints, manifest expansion, and backward-compatibility verification."
trigger_phrases:
  - "fan-out live-tools tasks"
  - "fanout search adapter tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/005-fanout-live-tools-unblock"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/005-fanout-live-tools-unblock"
    last_updated_at: "2026-07-15T13:07:03Z"
    last_updated_by: "codex"
    recent_action: "Sequenced the schema, adapter, manifest, and backward-compatibility tasks"
    next_safe_action: "Capture legacy fixtures before implementing the typed live-tools policy"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Fan-out Live-Tools Unblock

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

- [ ] T001 Confirm phase 001 is complete and record its frozen executor/transition vocabulary
- [ ] T002 Capture green baseline fixtures for legacy config parsing, lineage expansion, cli-codex argv, pool behavior, and persisted artifacts
- [ ] T003 Inventory all consumers of `ExecutorConfig`, `FanoutConfig`, `expandLineages`, and `buildLineageCommand` before changing their return shapes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the nested `liveTools.webSearch` enum and backward-compatible `inherit` default to `executor-config.ts`
- [ ] T005 Add an exhaustive executor-kind capability matrix and pre-dispatch rejection for unsupported requested search modes
- [ ] T006 Refactor command construction into per-kind adapters while preserving every legacy `inherit` command fixture
- [ ] T007 Implement the `cli-codex` live adapter with top-level `--search` before `exec`
- [ ] T008 Return canonical effective config and a secret-free invocation fingerprint from every adapter
- [ ] T009 Add the mutually exclusive models × branches × replicas manifest schema and deterministic logical branch ID compiler
- [ ] T010 Feed compiled lineages into the unchanged aggregate-budget and `runCappedPool` path without canonical persistence changes
- [ ] T011 Add focused config, adapter, fingerprint, manifest, pre-spawn rejection, and legacy-parity unit fixtures
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Verify: a live `cli-codex` leaf launches as `codex --search exec` and completes with live-search evidence
- [ ] T013 Verify: every unsupported kind × requested search-policy cell fails before any pool worker or subprocess spawn
- [ ] T014 Verify: omitted `liveTools` and legacy `executors[]` + `count` produce baseline-equivalent argv, IDs, scheduling, retries, budgets, summaries, and artifacts
- [ ] T015 Verify: models × branches × replicas expansion is deterministic, collision-free, ceiling-aware, and stable across repeated runs
- [ ] T016 Verify: invocation fingerprints are deterministic, input-sensitive, version-aware, and exclude prompts, credentials, and raw environment values
- [ ] T017 Verify: no canonical state/event/checkpoint/status-ledger/fan-in schema changed; durable receipts remain phase-006 work
- [ ] T018 Run the targeted Vitest suites, relevant full runtime gate, and phase `validate.sh --strict`
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
