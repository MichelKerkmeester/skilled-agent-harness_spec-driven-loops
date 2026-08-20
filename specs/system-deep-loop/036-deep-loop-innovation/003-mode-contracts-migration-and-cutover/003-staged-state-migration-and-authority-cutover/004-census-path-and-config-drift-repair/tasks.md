---
title: "Tasks: Census Path and Config Drift Repair"
description: "Tasks for repairing 7 stale state-census path references and closing a fan-out config schema gap that silently dropped a smuggled stopPolicy key."
trigger_phrases:
  - "census path and config drift repair tasks"
  - "deep-loop stale census path fix tasks"
  - "fan-out stop policy schema fix tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
    last_updated_at: "2026-08-19T04:07:45Z"
    last_updated_by: "claude"
    recent_action: "All tasks done; 236 tests restored, config 90/90, consumers 199/199"
    next_safe_action: "None -- census/manifest divergence tracked as an open finding"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Census Path and Config Drift Repair

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

- [x] T001 Reproduce the `ENOENT` failure across the census-referencing runtime test files and isolate it to exactly
  7 files sharing the same missing `001-research-inputs-and-architecture/` path segment — command: run the 7-file
  target set [evidence: BEFORE run — 7 files failed, 5 tests failed, 33 passed, 38 discovered]
- [x] T002 Confirm the census's actual on-disk location is
  `001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/` and that the 6 already-correct
  callers reference it that way — grep confirms the correct 6 callers use the segment; the 7 broken callers omit it
- [x] T003 [P] Reproduce the fan-out config schema gap: pass `stopPolicy` inside the fan-out config JSON and confirm
  it parses silently, with the key absent from the parsed config and no error raised, in both the legacy
  executor-list and the Cartesian manifest config shapes
- [x] T004 [P] Locate the existing `z.never().optional()` idiom in `runtime/lib/deep-loop/executor-config.ts` for
  keys that must not appear on a given config shape, to match the fix to the file's own convention
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Insert the missing `001-research-inputs-and-architecture/` path segment in `cutover-certificate.vitest.ts`
  — one line, no other edit [evidence: file resolves the census path after the fix]
- [x] T006 Insert the missing path segment in `inflight-state-classification.vitest.ts` — one line, no other edit
  [evidence: file resolves the census path after the fix]
- [x] T007 Insert the missing path segment in `inflight-state-migration.vitest.ts` — one line, no other edit
  [evidence: file resolves the census path after the fix]
- [x] T008 Insert the missing path segment in `legacy-projections.test.ts` — one line, no other edit [evidence: file
  resolves the census path after the fix; the file becomes collectable, though one of its tests fails for the
  unrelated reason tracked in T014]
- [x] T009 Insert the missing path segment in `mixed-version-fixtures.vitest.ts` — one line, no other edit
  [evidence: file resolves the census path after the fix]
- [x] T010 Insert the missing path segment in `per-mode-authority-flip.vitest.ts` — one line, no other edit
  [evidence: file resolves the census path after the fix]
- [x] T011 Insert the missing path segment in `rollback-drills.vitest.ts` — one line, no other edit [evidence: file
  resolves the census path after the fix]
- [x] T012 Add `stopPolicy: z.never().optional()` to the shared fan-out control shape in
  `runtime/lib/deep-loop/executor-config.ts`, matching the file's existing idiom [evidence: passing `stopPolicy` in
  either fan-out config variant now throws `ExecutorConfigError`]
- [x] T013 Add the regression test `rejects a stop policy smuggled into the fan-out config instead of the CLI flag`
  to `runtime/tests/unit/executor-config.vitest.ts`, covering both the legacy executor-list and Cartesian manifest
  config variants [evidence: test fails against the pre-fix schema (red), passes against the post-fix schema
  (green)]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Re-run the same 7-file command used to capture the before state; record the after counts — AFTER: 1 file
  failed, 273/274 discovered passing [evidence: net 236 tests restored from being uncollectable, comparing 38/274
  discovered before/after]
- [x] T015 Run the whole `executor-config.vitest.ts` suite after the schema fix — [evidence: 90/90 passed]
- [x] T016 Re-run the four fan-out consumer suites (`fanout-run`, `fanout-pool`, `fanout-merge`, `fanout-salvage`)
  to confirm the schema addition does not regress any caller — [evidence: 199 passed across 4 files]
- [x] T017 Diagnose the one test that remains red after the path fix — `legacy-projections.test.ts` >
  `closes every JSON-bearing state census row with one owned disposition` — and identify the exact disagreement:
  census says `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`, live manifest and on-disk reality
  say `.opencode/skills/sk-prompt/sk-prompt-models/benchmarks/{run_label}/` [evidence: `sk-prompt-models/` exists on
  disk, `prompt-models/` does not]
- [x] T018 Attempt to correct the census row directly, observe the blast radius, and revert — editing
  `state-backend-census.json` to the correct live path changed the group from 1 failing test to 44, because other
  suites (`inflight-state-classification.vitest.ts`, `mixed-version-fixtures.vitest.ts`) derive classification
  evidence from the exact frozen bytes; the edit was reverted and recorded as a tracked open finding in
  `implementation-summary.md`, not claimed fixed
- [x] T019 Confirm 4 other census rows pointing at nonexistent paths are runtime-created artifacts (loop-guard
  state, compiled command assets) and their absence on a clean checkout is expected, not drift [evidence: 4/4
  nonexistent-path rows confirmed as expected runtime-created-artifact absence, not drift]
- [x] T020 Stash this packet's change and re-run `tests/stress/cli-adapter/fanout.vitest.ts` at base state to prove
  its one failing test is pre-existing and unrelated to this repair [evidence: 1 failed, 18 passed, 1 skipped, both
  with and without the change]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete — T001-T020 above
- [x] All requirements in spec.md met with evidence — see `checklist.md`
- [x] Phase gate green (targeted suites, whole `executor-config.vitest.ts` suite, and consumer suites as applicable)
  — 273/274 collected passing in the 7 repaired files (1 pre-existing, root-caused, tracked open finding); 90/90 on
  the config suite; 199/199 across the 4 fan-out consumer suites
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Census location**: See `../../../001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/spec.md`
- **Predecessor sibling**: See `../003-cutover-certificate-and-rollback-window/spec.md`
<!-- /ANCHOR:cross-refs -->
