---
title: "Implementation Summary: Census Path and Config Drift Repair"
description: "Repaired 7 stale state-census path references that made 5 runtime test files ENOENT-uncollectable, and closed a fan-out config schema gap that silently dropped a smuggled stopPolicy key."
trigger_phrases:
  - "census path and config drift repair implementation"
  - "deep-loop stale census path fix"
  - "fan-out stop policy schema fix"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
    last_updated_at: "2026-08-19T04:07:45Z"
    last_updated_by: "claude"
    recent_action: "Repaired 7 census paths and the stopPolicy schema gap; 236 tests restored"
    next_safe_action: "None -- census/manifest divergence tracked as an open finding"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/cutover-certificate.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/inflight-state-classification.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/inflight-state-migration.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/mixed-version-fixtures.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/per-mode-authority-flip.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/rollback-drills.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The census-vs-manifest divergence is not fixable inside this packet: editing the frozen census bytes to match the live path took the failing count from 1 to 44 because dependent suites read classification evidence from those exact bytes"
      - "The stress fanout failure is confirmed pre-existing via stash-based negative control, not caused by this repair"
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
| **Spec Folder** | 004-census-path-and-config-drift-repair |
| **Completed** | 2026-08-19 |
| **Level** | 2 |
| **Authority** | Test-discoverability and config-schema hygiene only; no migration, authority-flip, or cutover-certificate scope was touched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two unrelated defects were found and repaired while exercising the staged-migration test suites.

### Repair 1 -- seven stale state-census references

The baseline state census moved to `001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/`.
Only 6 of 13 runtime callers were updated when it moved; 7 were left pointing at the old location, which does not
exist on disk. Five of the seven threw `ENOENT` at module load, which does not fail a suite loudly -- Vitest simply
collects zero tests from a file whose import throws, so the suites silently stopped existing instead of reporting a
red run. The fix inserted the missing `001-research-inputs-and-architecture/` path segment in each of the 7 files
under `runtime/tests/unit/`: `cutover-certificate.vitest.ts`, `inflight-state-classification.vitest.ts`,
`inflight-state-migration.vitest.ts`, `legacy-projections.test.ts`, `mixed-version-fixtures.vitest.ts`,
`per-mode-authority-flip.vitest.ts`, `rollback-drills.vitest.ts` -- one line each, no other edit. After the fix, all
13 census references resolve.

### Repair 2 -- stop policy silently dropped by the fan-out config schema

`fanoutConfigSchema` in `runtime/lib/deep-loop/executor-config.ts` had no `stopPolicy` key. Zod's default object
parsing drops unrecognized keys silently, so a caller who passed `stopPolicy` in the fan-out config JSON had it
discarded without warning; the value was only ever read from the `--stop-policy` CLI flag. A caller who believed
forced depth was pinned instead got a convergence-driven stop, and the resulting artifacts read as a legitimate
convergence -- the mistake is invisible after the fact. This exact failure shape was already recorded once as a
permanent run-integrity defect in a sibling drift-census packet, where one research lineage's stopping point became
unverifiable. The fix adds `stopPolicy: z.never().optional()` to the shared fan-out control shape, matching the
file's existing idiom for keys that must not appear on that shape. Passing it now throws `ExecutorConfigError`
instead of being silently stripped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/tests/unit/cutover-certificate.vitest.ts` | Modified | Inserted missing `001-research-inputs-and-architecture/` census path segment |
| `runtime/tests/unit/inflight-state-classification.vitest.ts` | Modified | Inserted missing census path segment |
| `runtime/tests/unit/inflight-state-migration.vitest.ts` | Modified | Inserted missing census path segment |
| `runtime/tests/unit/legacy-projections.test.ts` | Modified | Inserted missing census path segment |
| `runtime/tests/unit/mixed-version-fixtures.vitest.ts` | Modified | Inserted missing census path segment |
| `runtime/tests/unit/per-mode-authority-flip.vitest.ts` | Modified | Inserted missing census path segment |
| `runtime/tests/unit/rollback-drills.vitest.ts` | Modified | Inserted missing census path segment |
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Added `stopPolicy: z.never().optional()` to the shared fan-out control shape |
| `runtime/tests/unit/executor-config.vitest.ts` | Modified | Added the `rejects a stop policy smuggled into the fan-out config instead of the CLI flag` regression test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both repairs are minimal, one-shape fixes matched to the file's own existing conventions rather than new machinery:
the path fix mirrors the 6 already-correct callers, and the schema fix mirrors the file's existing
`z.never().optional()` idiom for keys that must not appear on a given config shape. The regression test was proven
red against the pre-fix schema and green against the post-fix schema before being accepted as coverage. The one
remaining red test was investigated to its root cause rather than left unexplained, and a direct fix for it was
attempted and measured before being reverted once its blast radius on dependent suites was observed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Insert the missing path segment rather than restructure the census reference pattern | The other 6 callers already reference the census correctly with that exact segment; matching them is the smallest fix and needs no new indirection layer. |
| Add `stopPolicy: z.never().optional()` instead of a custom validation error | The file already uses this idiom for keys that must not appear on a config shape; reusing it keeps the schema's rejection behavior consistent instead of introducing a second mechanism. |
| Reject the smuggled key instead of accepting and ignoring it | A loud `ExecutorConfigError` is strictly safer than the prior silent-drop behavior for a value that decides whether a run's stopping point is pinned or convergence-driven and unverifiable after the fact. |
| Do not edit the frozen census bytes to fix the one remaining test | The edit was attempted and measured: the failing count rose from 1 to 44 because other suites derive classification evidence from those exact bytes. Fixing the test's contract is a decision for whoever owns that assertion, not a side effect of a path-and-schema repair. |
| Verify the stress-test failure is pre-existing with a stash-based negative control, not an assumption | Reproducing the identical failure with the change stashed out is the only way to be certain this repair did not cause it, rather than merely observing it fails both before and after in sequence. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Census path repair, before | 7 files failed, 5 tests failed, 33 passed, 38 discovered (same 7-file command) |
| Census path repair, after | 1 file failed, 273 passed, 274 discovered (same 7-file command) -- net 236 tests restored from being uncollectable |
| Config schema regression test | Proven red against the pre-fix schema, green against the post-fix schema; covers both the legacy executor-list and Cartesian manifest config variants |
| Whole `executor-config.vitest.ts` suite | PASS: 90/90 |
| Fan-out consumer suites (`fanout-run`, `fanout-pool`, `fanout-merge`, `fanout-salvage`) | PASS: 199 passed across 4 files |
| Frozen-census direct-correction attempt | REVERTED: editing `state-backend-census.json` to the live `sk-prompt-models` path moved the group from 1 failing test to 44; the edit was not kept |
| Pre-existing stress-test failure (`tests/stress/cli-adapter/fanout.vitest.ts`) | Confirmed pre-existing and unrelated: 1 failed, 18 passed, 1 skipped, identical with the change stashed out and applied |
| Final-state re-run, all 8 touched files | 363 passed, 1 failed, 364 discovered (314.94s). The single failure is the tracked census-vs-manifest row below; the other 7 files are fully green |
| `validate.sh --strict`, this phase and its parent | Errors: 0 on this folder and on `003-staged-state-migration-and-authority-cutover` including all four children. One warning remains, `GRAPH_METADATA_CHILD_DRIFT: child-drift scanner dist is stale`, reproduced identically on an untouched sibling packet and therefore environmental |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Tracked open finding, not fixed here:** `legacy-projections.test.ts` > `closes every JSON-bearing state census
   row with one owned disposition` still fails. It asserts the frozen census equals the live runtime manifest, and
   they disagree on one row: the census says
   `.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/`, while the live manifest and on-disk reality
   say `.opencode/skills/sk-prompt/sk-prompt-models/benchmarks/{run_label}/`. `sk-prompt-models/` exists on disk;
   `prompt-models/` does not. The runtime manifest is correct; the census row is stale because a hub merge renamed
   the mode but the directory kept its old name, and the census recorded the mode name as if it were the filesystem
   path. Correcting the census byte-for-byte was attempted and reverted: several suites derive classification
   evidence directly from the frozen census bytes, and the edit took the group from 1 failing test to 44. The
   census is therefore effectively byte-frozen. The real conclusion is that this test asserts a frozen historical
   record still matches live code, which will break on any legitimate rename; resolving it means changing the
   test's own contract, which belongs to whoever owns that assertion, not to this repair.
2. **Four other census rows point at paths that do not exist**, but this is expected, not drift: those rows are
   runtime-created artifacts (loop-guard state, compiled command assets) that are absent on a clean checkout by
   design.
3. **`description.json`/`graph-metadata.json` are not hand-authored by this build.** They are machine-generated and
   reconciled by a later `generate-context.js` pass, consistent with the sibling `001` and `003` packets' own
   deferral.
<!-- /ANCHOR:limitations -->
