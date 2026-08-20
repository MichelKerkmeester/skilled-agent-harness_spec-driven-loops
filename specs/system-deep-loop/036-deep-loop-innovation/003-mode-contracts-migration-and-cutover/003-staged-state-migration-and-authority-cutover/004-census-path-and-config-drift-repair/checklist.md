---
title: "Checklist: Census Path and Config Drift Repair"
description: "Checklist verifying the state-census path repair across 7 files and the fan-out config schema fix that now rejects a smuggled stopPolicy key."
trigger_phrases:
  - "census path and config drift repair checklist"
  - "deep-loop stale census path fix verification"
  - "fan-out stop policy schema fix gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
    last_updated_at: "2026-08-19T04:07:45Z"
    last_updated_by: "claude"
    recent_action: "Ratified all P0/P1/P2 checks against the measured before/after test evidence"
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
# Verification Checklist: Census Path and Config Drift Repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the census-path and config-drift repair. Every item is
checked against a measured before/after test command, not an assumption. The verifier fails on a repair that is
claimed without a same-command before/after comparison, a regression test that was not proven red-before/green-after,
a consumer suite that was not re-run, or a still-failing test that is silently left unexplained. This packet touches
only path literals in 7 test files and one schema key in `executor-config.ts`; no migration, authority-flip, or
cutover-certificate behavior was changed.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The `ENOENT` failure was reproduced and isolated to exactly 7 files sharing one missing path
  segment, not assumed from a partial read — BEFORE run: 7 files failed, 5 tests failed, 33 passed, 38 discovered
- [x] CHK-002 [P0] The census's actual on-disk location was confirmed against the 6 already-correct callers before
  writing any fix — `001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/` is the real
  location; the 6 correct callers already use that segment
- [x] CHK-003 [P1] The fan-out config schema gap was reproduced before writing the fix: a `stopPolicy` key inside
  the fan-out config JSON parsed silently with the value absent, for both config variants
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Each of the 7 path fixes is a single inserted path segment, no other edit to test logic or
  fixtures — `git diff` scope for each file is one line
- [x] CHK-005 [P1] The schema fix matches the file's own existing idiom (`z.never().optional()`) for keys that must
  not appear on a given config shape, instead of inventing a new rejection mechanism — `stopPolicy: z.never().optional()`
  added to the shared fan-out control shape in `executor-config.ts:653`
- [x] CHK-006 [P2] No migration, authority-flip, or cutover-certificate disposition logic was touched by either
  repair — the diff is scoped to path literals and one schema key
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] The same 7-file command measures the before and after state, not two different commands —
  BEFORE: 7 files failed, 5 tests failed, 33/38 discovered passing; AFTER: 1 file failed, 273/274 discovered passing
- [x] CHK-008 [P0] Net test recovery is computed from the actual discovered counts, not asserted — 236 tests
  restored from being uncollectable (38/274 discovered, before/after)
- [x] CHK-009 [P0] The `stopPolicy` schema fix throws `ExecutorConfigError` for both the legacy executor-list and
  Cartesian manifest config variants — regression test `rejects a stop policy smuggled into the fan-out config
  instead of the CLI flag` in `executor-config.vitest.ts` covers both
- [x] CHK-010 [P0] The regression test was proven red against the pre-fix schema and green against the post-fix
  schema, not written only after the fix already existed — confirmed via direct re-run of
  `rejects a stop policy smuggled into the fan-out config instead of the CLI flag` against each schema state
- [x] CHK-011 [P0] The whole `executor-config.vitest.ts` suite passes after the schema change, not only the new
  test — 90/90 passed
- [x] CHK-012 [P0] All four fan-out consumer suites that could be affected by the schema change were re-run in full
  — `fanout-run`, `fanout-pool`, `fanout-merge`, `fanout-salvage`: 199 passed across 4 files
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-013 [P0] The one test that remains red after the path fix is root-caused with the exact evidence, not
  left as an unexplained failure — `legacy-projections.test.ts` > `closes every JSON-bearing state census row with
  one owned disposition` disagrees with the live manifest on one row: census says
  `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`, on-disk reality and the live manifest say
  `.opencode/skills/sk-prompt/sk-prompt-models/benchmarks/{run_label}/`; `sk-prompt-models/` exists, `prompt-models/`
  does not
- [x] CHK-014 [P1] A direct correction of the frozen census row was attempted, its blast radius was measured, and
  it was reverted rather than silently kept or silently abandoned — editing the census byte-for-byte to the correct
  path moved the group from 1 failing test to 44 because dependent suites read classification evidence from the
  frozen bytes; the edit was reverted and the divergence is recorded as a tracked open finding in
  `implementation-summary.md`, not claimed fixed
- [x] CHK-015 [P2] The 4 other census rows pointing at nonexistent paths were checked and confirmed to be normal
  runtime-created-artifact absence, not additional drift — loop-guard state and compiled command assets that do not
  exist on a clean checkout by design
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-016 [P2] The schema change fails closed (`ExecutorConfigError`) rather than silently accepting or
  silently continuing to drop the smuggled key — a caller mistake that previously produced an unverifiable
  convergence result now produces an immediate, loud error at config-parse time
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-017 [P1] The pre-existing, unrelated stress-test failure was verified with a negative control rather than
  assumed pre-existing — stashing this packet's change and re-running
  `tests/stress/cli-adapter/fanout.vitest.ts` reproduces 1 failed, 18 passed, 1 skipped identically with and
  without the change
- [x] CHK-018 [P2] The phase outcome is reflected in this packet's docs without overstating what was fixed — the
  frozen-census/live-manifest divergence is documented as a tracked open finding for whoever owns that assertion,
  never claimed resolved
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-019 [P1] Every changed file is inside `runtime/tests/unit/` (the 7 path fixes plus the new regression
  test) or `runtime/lib/deep-loop/executor-config.ts` (the schema key) — no file outside those two areas was
  modified
- [x] CHK-020 [P2] `description.json`/`graph-metadata.json` are machine-generated, with one recorded exception:
  `level` was set by hand to `"2"`, mirroring the sibling phases. The generator preserves that key when it is
  already present but does not derive it for a brand-new folder, so a fresh generation leaves it absent and
  `DESCRIPTION_SHAPE` then fails. Re-running the generator here keeps the value; deleting the file loses it
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0/P1/P2 check above has measured evidence, the before/after comparison uses the
same command, the schema regression test is proven red-before/green-after, every affected consumer suite is re-run
green, the one remaining failure is root-caused and tracked rather than silently claimed fixed, and the one
pre-existing unrelated failure is confirmed with a negative control. All 20 items above have evidence and none was
deferred.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off: the SOL verifier confirms the P0 path and schema repairs, the measured before/after counts (38 -> 274
discovered, 236 tests restored), the schema suite (90/90) and consumer suites (199/4 files) are green, and the one
remaining failure is a documented, root-caused, tracked open finding rather than an unexplained or falsely-claimed
fix. The pre-existing stress-test failure was confirmed unrelated via a stash-based negative control (1 failed, 18
passed, 1 skipped, identical with and without the change).
<!-- /ANCHOR:sign-off -->
