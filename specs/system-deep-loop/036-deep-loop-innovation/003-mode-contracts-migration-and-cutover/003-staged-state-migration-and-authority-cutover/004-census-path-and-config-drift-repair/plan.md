---
title: "Implementation Plan: Census Path and Config Drift Repair"
description: "Implementation Plan for repairing 7 stale state-census path references and closing a fan-out config schema gap that silently dropped a smuggled stopPolicy key."
trigger_phrases:
  - "census path and config drift repair implementation plan"
  - "deep-loop stale census path fix plan"
  - "fan-out stop policy schema fix plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
    last_updated_at: "2026-08-19T04:07:45Z"
    last_updated_by: "claude"
    recent_action: "Documented the already-executed path repair and schema fix with measured before/after evidence"
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
# Implementation Plan: Census Path and Config Drift Repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime test discoverability + fan-out executor config schema (phase-014 sibling 004) |
| **Change class** | Drift repair: stale path literals and a schema hardening; no runtime disposition logic changed |
| **Execution** | Two independent, isolated repairs; both reversible in a single revert per file |

### Overview
Two unrelated defects were found while exercising the staged-migration test suites. First, a spec-folder move left
7 of 13 state-census callers pointing at a location that no longer exists, so 5 files threw `ENOENT` at import time
and silently dropped out of test collection instead of failing loudly. Second, `fanoutConfigSchema` had no key for
`stopPolicy`, so a caller who put it in the fan-out config JSON had it silently discarded by Zod's default
unknown-key-drop behavior, with no error and no warning. Both are one-shape fixes: insert the missing path segment
in each of the 7 files, and add one `z.never().optional()` schema key so the same input now throws instead of being
swallowed. Neither repair touches migration, authority-flip, or cutover-certificate behavior.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The stale-path failure was reproduced and isolated to exactly 7 files, all with the same missing
  `001-research-inputs-and-architecture/` path segment
- [x] The config-schema gap was reproduced: a `stopPolicy` key inside the fan-out config JSON parses without error
  and the value is absent from the parsed config
- [x] The existing `z.never().optional()` idiom for "keys that must not appear" was located in
  `executor-config.ts` so the fix matches the file's own convention rather than inventing a new one

### Definition of Done
- [x] All 7 files resolve the census path correctly and are collectable by Vitest
- [x] `fanoutConfigSchema` throws `ExecutorConfigError` for a smuggled `stopPolicy` key in both config variants,
  proven red-before/green-after with a dedicated regression test
- [x] Every fan-out consumer suite that could be affected by the schema change was re-run and is green
- [x] The one test that remained red after the path fix is root-caused and documented as a tracked open finding,
  not silently left unexplained or falsely claimed fixed
- [x] The one already-red stress test is confirmed pre-existing via a stash-based negative control
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Path repair**: each of the 7 files under `runtime/tests/unit/` referenced the frozen state census by a relative
  literal that was missing the `001-research-inputs-and-architecture/` segment the census folder was moved under.
  The fix is a single inserted path segment per file, matching the 6 callers that were already correct after the
  move. No test logic, fixture shape, or assertion changed.
- **Schema hardening**: `fanoutConfigSchema` in `runtime/lib/deep-loop/executor-config.ts` is a Zod object schema.
  Zod's default parsing drops unrecognized keys instead of rejecting them, so an unrecognized `stopPolicy` key was
  silently discarded rather than surfaced. The file already uses `z.never().optional()` for other keys that are
  valid on a sibling config shape but must not appear on this one; `stopPolicy` is added to that same idiom, so
  parsing now throws `ExecutorConfigError` for the smuggled key instead of stripping it.
- **Regression coverage**: `executor-config.vitest.ts` gained one test asserting rejection of a `stopPolicy` key
  smuggled into the fan-out config JSON, covering both the legacy executor-list config shape and the Cartesian
  manifest config shape, since both route through `fanoutConfigSchema`.
- **Verification boundary**: the repair's correctness is measured, not assumed -- the same 7-file test command was
  run before and after the path fix, the regression test was run red against the pre-fix schema and green against
  the post-fix schema, the four fan-out consumer suites were re-run in full, and the one pre-existing stress failure
  was reproduced identically with the change stashed out.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Reproduce the `ENOENT` failures in the 7 census-referencing files and confirm all 7 share the identical missing
  `001-research-inputs-and-architecture/` path segment against the census's actual on-disk location.
- Reproduce the config-schema gap: pass `stopPolicy` inside the fan-out config JSON and confirm it parses silently
  with the value absent, for both the legacy executor-list and Cartesian manifest config shapes.
- Locate the existing `z.never().optional()` idiom in `executor-config.ts` to match the fix to the file's own
  convention.

### Phase 2: Implementation
- Insert the missing `001-research-inputs-and-architecture/` path segment in each of the 7 files: `cutover-certificate.vitest.ts`,
  `inflight-state-classification.vitest.ts`, `inflight-state-migration.vitest.ts`, `legacy-projections.test.ts`,
  `mixed-version-fixtures.vitest.ts`, `per-mode-authority-flip.vitest.ts`, `rollback-drills.vitest.ts` -- one line
  each, no other edit.
- Add `stopPolicy: z.never().optional()` to the shared fan-out control shape in `executor-config.ts`.
- Add the regression test `rejects a stop policy smuggled into the fan-out config instead of the CLI flag` to
  `executor-config.vitest.ts`, covering both config variants.

### Phase 3: Verification
- Re-run the 7 repaired files with the same command used to capture the before state; record the after counts.
- Run the new regression test against the pre-fix schema (red) and the post-fix schema (green); run the whole
  `executor-config.vitest.ts` suite.
- Re-run the four fan-out consumer suites (`fanout-run`, `fanout-pool`, `fanout-merge`, `fanout-salvage`).
- Attempt to correct the one remaining frozen-census/live-manifest divergence directly; observe the failure count
  rise from 1 to 44 across dependent suites; revert that edit and document the divergence as a tracked open finding
  instead.
- Stash this packet's change and re-run `tests/stress/cli-adapter/fanout.vitest.ts` to confirm its one failure is
  pre-existing and identical with and without the change.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Grep the census filename across `runtime/` after the fix; every reference resolves to an existing on-disk path |
| REQ-002 | Same 7-file command before/after: 7 failed / 5 tests failed / 33 passed / 38 discovered -> 1 failed / 273 passed / 274 discovered |
| REQ-003 | Passing `stopPolicy` in either fan-out config variant throws `ExecutorConfigError` after the fix |
| REQ-004 | New regression test fails against the pre-fix schema, passes against the post-fix schema; whole suite 90/90 passed |
| REQ-005 | `fanout-run`, `fanout-pool`, `fanout-merge`, `fanout-salvage` re-run green: 199 passed across 4 files |
| REQ-006 | Root-cause diagnosis of the remaining `legacy-projections.test.ts` failure recorded with the exact census-vs-manifest path disagreement |
| REQ-007 | Stash-based negative control: `tests/stress/cli-adapter/fanout.vitest.ts` reproduces 1 failed / 18 passed / 1 skipped both with and without the change |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The repair consumes the frozen phase-003 state census at
[`../../../001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/`](../../../001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/spec.md)
and the fan-out executor config contract in
`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`. It has no dependency on
`002-per-mode-authority-flip` or `003-cutover-certificate-and-rollback-window` beyond sharing the same test corpus;
none of those siblings' scope was touched.

No successor packet is declared to consume this repair's output directly; it is a hygiene fix that keeps the
existing `001`-`003` sibling suites collectable and keeps the fan-out config contract fail-closed for a caller
mistake that was previously invisible.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each of the 7 path fixes is a single reverted line per file, restoring the prior (broken) literal; this would
restore the ENOENT-uncollectable state and is not recommended, but is trivially reversible if the census ever moves
again and a different reference point is needed. The `stopPolicy: z.never().optional()` schema addition is a single
line revert in `executor-config.ts`; removing it restores the prior silent-drop behavior, which is the exact defect
this packet closes, so reverting it should only happen alongside a replacement fix, not as a bare rollback.

The frozen-census correction was itself already rolled back during this packet's own verification: editing
`state-backend-census.json` to match the live `sk-prompt-models` path took the group from 1 failing test to 44
because several suites derive classification evidence from the exact frozen bytes, so that edit was reverted and the
census file is unmodified by this packet.
<!-- /ANCHOR:rollback -->
