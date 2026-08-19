---
title: "Feature Specification: Census Path and Config Drift Repair"
description: "Repair seven stale state-census path references that made five runtime test files ENOENT-uncollectable, and close a fan-out config schema gap that let a stopPolicy value be silently dropped instead of read."
trigger_phrases:
  - "census path and config drift repair"
  - "deep-loop stale state census path"
  - "fan-out stop policy smuggled config"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair"
    last_updated_at: "2026-08-19T04:07:45Z"
    last_updated_by: "claude"
    recent_action: "Documented the landed census-path and stopPolicy schema repair"
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

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Census Path and Config Drift Repair

> Phase adjacency under `003-staged-state-migration-and-authority-cutover` (navigation order, not a hard runtime dependency): predecessor `003-cutover-certificate-and-rollback-window`; successor `none` (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/004-census-path-and-config-drift-repair |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Owner skill** | system-deep-loop |
| **Origin** | Discovered while exercising the staged-migration test suites: a spec-folder move left 7 of 13 census callers pointing at a path that does not exist on disk, and a fan-out config schema gap let `stopPolicy` be silently discarded |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The frozen baseline state census moved to `001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/`.
Only 6 of the 13 runtime callers that reference it were updated when it moved; 7 were left pointing at the old
location, which no longer exists on disk. Five of those seven files threw `ENOENT` at module load. Vitest does not
fail a suite loudly when its module throws at import time -- it simply collects zero tests from that file, so the
suites silently stopped existing instead of reporting a red run. This is a worse failure mode than a normal red test:
a `git log`/CI summary that only counts pass/fail totals could show a shrinking, all-green run and never notice that
five files dropped out of collection.

Independently, `fanoutConfigSchema` in `runtime/lib/deep-loop/executor-config.ts` had no `stopPolicy` key. Zod object
parsing drops unknown keys silently by default, so a caller who put `stopPolicy` inside the fan-out config JSON --
believing it pinned a forced depth -- had that value discarded without any warning. The run then stops on
convergence instead of the caller's intended forced depth, and the resulting artifacts read as a legitimate
convergence, so the mistake is invisible after the fact. A sibling drift-census packet already recorded this exact
failure shape once, as a permanent run-integrity defect where one research lineage's stopping point became
unverifiable after the fact.

This packet repairs both defects: it restores all 13 census references to the location the phase-003 census actually
lives at, and it makes the fan-out config schema fail loudly (`ExecutorConfigError`) instead of silently stripping a
smuggled `stopPolicy` key. It also documents, rather than "fixes", the one test that stayed red after the path
repair -- a frozen historical census row that no longer matches a legitimately renamed live path -- because editing
the frozen census bytes to agree with that row breaks the other suites that depend on those exact bytes for
classification evidence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repair the 7 stale `001-research-inputs-and-architecture/`-prefix-missing state-census path references across
  `runtime/tests/unit/`: `cutover-certificate.vitest.ts`, `inflight-state-classification.vitest.ts`,
  `inflight-state-migration.vitest.ts`, `legacy-projections.test.ts`, `mixed-version-fixtures.vitest.ts`,
  `per-mode-authority-flip.vitest.ts`, `rollback-drills.vitest.ts` -- one inserted path segment per file, no other
  edit.
- Close the `fanoutConfigSchema` gap in `runtime/lib/deep-loop/executor-config.ts` by adding
  `stopPolicy: z.never().optional()`, matching the file's existing idiom for keys that must not appear in that
  config shape, so passing it throws `ExecutorConfigError` instead of being silently stripped.
- Add a regression test to `runtime/tests/unit/executor-config.vitest.ts` covering both the legacy executor-list and
  the Cartesian manifest config variants for the smuggled `stopPolicy` case.
- Re-run the 7 repaired files, the config-schema regression suite, and the four fan-out consumer suites
  (`fanout-run`, `fanout-pool`, `fanout-merge`, `fanout-salvage`) and record the measured before/after counts.
- Diagnose and honestly document the one test that remained red after the path repair, and confirm the one stress
  test that was already red before this repair is unrelated to it.

### Out of Scope
- Rewriting the frozen `state-backend-census.json` bytes to agree with the live runtime manifest. This was attempted
  and reverted (see Risks & Dependencies); it belongs to whoever owns the frozen-census assertion, not this repair.
- Any other census row that points at a runtime-created artifact path that does not yet exist on a clean checkout
  (loop-guard state, compiled command assets); their absence is normal, not drift, and is out of scope for this
  packet.
- Fixing `tests/stress/cli-adapter/fanout.vitest.ts`'s one pre-existing failing test; it is verified pre-existing and
  unrelated to either repair in this packet.
- Any change to migration, authority-flip, or cutover-certificate behavior; this packet touches only path literals
  and a config-schema key, never runtime disposition logic.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 13 runtime references to the baseline state census resolve to its actual on-disk location | The 7 files listed in Scope each have the missing `001-research-inputs-and-architecture/` path segment inserted; grepping the census filename across `runtime/` shows every reference resolving to an existing path |
| REQ-002 | The 5 files that were previously ENOENT-uncollectable are collectable and pass | Re-running the 7 files after the fix reports 1 file failed (the tracked open finding), 273 passed, 274 discovered -- versus 7 files failed, 5 tests failed, 33 passed, 38 discovered before the fix |
| REQ-003 | `fanoutConfigSchema` rejects a `stopPolicy` key instead of silently dropping it | Passing `stopPolicy` inside the fan-out config JSON throws `ExecutorConfigError`, for both the legacy executor-list config shape and the Cartesian manifest config shape |
| REQ-004 | The schema fix has dedicated regression coverage, verified red-before/green-after | `executor-config.vitest.ts` test `rejects a stop policy smuggled into the fan-out config instead of the CLI flag` fails against the pre-fix schema and passes against the post-fix schema; whole suite 90/90 passed |
| REQ-005 | Fan-out consumer suites are unaffected by the schema addition | `fanout-run`, `fanout-pool`, `fanout-merge`, `fanout-salvage` re-run green after the change: 199 passed across 4 files |
| REQ-006 | The one test that remains red is documented, not silently left unexplained | `legacy-projections.test.ts` > `closes every JSON-bearing state census row with one owned disposition` is diagnosed as a frozen-census-vs-live-manifest divergence over the `sk-prompt-models` rename, recorded as a tracked open finding in `implementation-summary.md` |
| REQ-007 | The pre-existing stress-test failure is confirmed unrelated to this repair, not silently assumed | Stashing this packet's change and re-running `tests/stress/cli-adapter/fanout.vitest.ts` reproduces the identical result at base state: 1 failed, 18 passed, 1 skipped, both with and without the change |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 7 repaired files each resolve their state-census reference and no longer throw `ENOENT` at module load.
- **SC-002**: The same 7-file command that measured 7 failed / 5 tests failed / 33 passed / 38 discovered before the
  fix measures 1 failed / 273 passed / 274 discovered after the fix -- 236 tests restored from being uncollectable.
- **SC-003**: `fanoutConfigSchema` throws `ExecutorConfigError` for a `stopPolicy` key in either fan-out config
  variant instead of silently discarding it.
- **SC-004**: The new regression test is proven red against the pre-fix schema and green against the post-fix schema;
  the whole `executor-config.vitest.ts` suite passes 90/90.
- **SC-005**: All four fan-out consumer suites re-run green after the schema change: 199 passed across 4 files.
- **SC-006**: The one still-failing test is root-caused to a frozen-census/live-manifest divergence over a hub-merge
  rename (`prompt-models/` -> `sk-prompt-models/`), and the attempted census-byte correction is documented as
  reverted rather than silently abandoned.
- **SC-007**: The pre-existing stress-test failure is proven unaffected by this repair through an explicit stash-based
  negative control, not assumed.

**Given** a runtime test file whose only load-time failure is a stale state-census path, **When** the missing
`001-research-inputs-and-architecture/` path segment is inserted, **Then** the file becomes collectable and its
tests execute against the same evidence the other 6 already-correct callers use.

**Given** `fanoutConfigSchema` receiving a `stopPolicy` key inside the fan-out config JSON, **When** the config is
parsed, **Then** parsing throws `ExecutorConfigError` for both the legacy executor-list and Cartesian manifest
variants instead of silently stripping the key.

**Given** the frozen `state-backend-census.json` bytes and the live runtime manifest disagree on one row's path
because of a hub-merge rename, **When** the census bytes are edited to match the live path, **Then** the edit is
rejected as a repair path because several other suites derive classification evidence from those exact frozen bytes,
and the failing-test count rises from 1 to 44.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child declares `depends_on: []` in phase-014 navigation terms; adjacency to `003-cutover-certificate-and-rollback-window`
is ordering, not a hard runtime dependency. The repair consumes the frozen phase-003 state census at its correct
location (`../../../001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/`) and the fan-out
executor config contract in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`.

The highest risk this packet identified and then avoided is treating the frozen census as a mutable source of truth.
Editing `state-backend-census.json` to correct the one stale `sk-prompt-models` row changed its bytes; because
several suites (including `inflight-state-classification.vitest.ts` and `mixed-version-fixtures.vitest.ts`) derive
classification evidence directly from those bytes, the edit moved the group from 1 failing test to 44. That edit was
reverted. The census is therefore treated as effectively byte-frozen for this packet: the correct repair is either a
change to the test's assertion contract (owned by whoever owns that assertion, not this packet) or a coordinated,
separately-scoped re-freeze of the census alongside every dependent suite's fixtures, not a silent one-line edit
inside a path-and-schema repair.

A second, lower risk is that `fanoutConfigSchema`'s new `stopPolicy: z.never().optional()` key could reject a caller
that legitimately intended to configure stop policy through the fan-out config JSON rather than the `--stop-policy`
CLI flag. The schema change is deliberately a hard rejection rather than a silent pass-through, on the reasoning
that a loud `ExecutorConfigError` is strictly safer than the prior silent-drop behavior for a value that controls
whether a run's stopping point is pinned or convergence-driven.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for this repair's own scope. One tracked open finding is carried forward for a future owner: the
`legacy-projections.test.ts` assertion `closes every JSON-bearing state census row with one owned disposition`
compares the frozen historical census to the live runtime manifest and currently disagrees on one row
(`.opencode/skills/sk-prompt/prompt-models/benchmarks/{run_label}/` in the census versus the on-disk
`.opencode/skills/sk-prompt/sk-prompt-models/benchmarks/{run_label}/`). The runtime manifest is correct; the census
row is stale from a hub merge that renamed the mode but not the directory the census recorded. Resolving this
requires deciding whether the test's contract should tolerate a documented, evidenced rename instead of demanding
byte-for-byte parity with a frozen record -- a decision for whoever owns that assertion, not a task of this packet.
<!-- /ANCHOR:questions -->
