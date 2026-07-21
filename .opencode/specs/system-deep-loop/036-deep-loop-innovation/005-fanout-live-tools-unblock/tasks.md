---
title: "Tasks: fan-out live-tools unblock"
description: "Tasks for the early dispatch-only fan-out live-tools unblock: policy, capabilities, adapters, fingerprints, manifest expansion, and backward-compatibility verification."
trigger_phrases:
  - "fan-out live-tools tasks"
  - "fanout search adapter tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-fanout-live-tools-unblock"
    last_updated_at: "2026-07-20T19:48:41Z"
    last_updated_by: "codex"
    recent_action: "Completed all schema, adapter, manifest, and backward-compatibility tasks"
    next_safe_action: "Use the verified adapter contract as input to the later durable-receipt work"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm phase 004 is complete and record its frozen executor/transition vocabulary [Evidence: implementation-summary.md Metadata records complete child commits `2429f4c`, `64eb3a9`, `9520601`]
- [x] T002 Capture green baseline fixtures for legacy config parsing, lineage expansion, cli-codex argv, pool behavior, and persisted artifacts [Test: `vitest` targeted baseline, 2 files and 126 tests, exit 0]
- [x] T003 Inventory all consumers of `ExecutorConfig`, `FanoutConfig`, `expandLineages`, and `buildLineageCommand` before changing their return shapes [Evidence: implementation-summary.md How It Was Delivered; only fanout-run consumes the fan-out/command APIs]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the nested `liveTools.webSearch` enum and backward-compatible `inherit` default to `executor-config.ts` [Test: executor web-search policy enum/default fixtures]
- [x] T005 Add an exhaustive executor-kind capability matrix and pre-dispatch rejection for unsupported requested search modes [Test: `declares every executor-kind by policy cell explicitly` and no-spawn cached-policy fixture]
- [x] T006 Refactor command construction into per-kind adapters while preserving every legacy `inherit` command fixture [Test: complete adapter contract and omitted-versus-inherit parity fixtures]
- [x] T007 Implement the `cli-codex` live adapter with top-level `--search` before `exec` [Test: direct and hermetic pooled Codex argv fixtures]
- [x] T008 Return canonical effective config and a secret-free invocation fingerprint from every adapter [Test: `fingerprints only the effective allowlist and prompt digest`]
- [x] T009 Add the mutually exclusive models × branches × replicas manifest schema and deterministic logical branch ID compiler [Test: `expands models by branches by replicas in stable model-first order` plus invalid/collision/ceiling fixtures]
- [x] T010 Feed compiled lineages into the unchanged aggregate-budget and `runCappedPool` path without canonical persistence changes [Test: 12-leaf manifest pool fixture; persistence-shape diff]
- [x] T011 Add focused config, adapter, fingerprint, manifest, pre-spawn rejection, and legacy-parity unit fixtures [Test: final targeted `vitest` suites, 141 tests, exit 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify: a live `cli-codex` leaf launches as `codex --search exec` and completes with live-search evidence [Test: hermetic pooled leaf, exit 0, first argv entries `--search`, `exec`]
- [x] T013 Verify: every unsupported kind × requested search-policy cell fails before any pool worker or subprocess spawn [Test: `rejects an unsupported policy before the pool or executor spawn is touched`]
- [x] T014 Verify: omitted `liveTools` and legacy `executors[]` + `count` produce baseline-equivalent argv, IDs, scheduling, retries, budgets, summaries, and artifacts [Test: 126 baseline tests remain green inside final 141-test run]
- [x] T015 Verify: models × branches × replicas expansion is deterministic, collision-free, ceiling-aware, and stable across repeated runs [Test: `expands models by branches by replicas in stable model-first order`, repeated 12-ID equality, collision rejection, and 256 ceiling]
- [x] T016 Verify: invocation fingerprints are deterministic, input-sensitive, version-aware, and exclude prompts, credentials, and raw environment values [Test: `fingerprints only the effective allowlist and prompt digest`]
- [x] T017 Verify: no canonical state/event/checkpoint/status-ledger/fan-in schema changed; durable receipts remain phase-009 work [Evidence: `implementation-summary.md` Persistence-Shape Diff]
- [x] T018 Run the targeted Vitest suites, relevant full runtime gate, and phase `validate.sh --strict` [Test: Vitest 141/141; node check exit 0; tsc exit 0; alignment 0 findings; strict validator exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T018 checked above]
- [x] All requirements in spec.md met with evidence [Evidence: implementation-summary.md Verification]
- [x] Phase gate green (validate/build/test as applicable) [Test: implementation-summary.md Exact Commands]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
