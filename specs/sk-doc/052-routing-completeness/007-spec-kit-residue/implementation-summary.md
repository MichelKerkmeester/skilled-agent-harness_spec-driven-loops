---
title: "Implementation Summary: Phase 7: spec-kit-residue"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "adr disposition"
  - "coverage graph repoint"
  - "injectable project root"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-03T23:30:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Ran the suite to completion, grouped the surviving residue, fixed the surviving references"
    next_safe_action: "Close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts"
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/generate-context-cli-authority.vitest.ts"
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/coverage-graph-cross-layer.vitest.ts"
      - ".opencode/skills/system-spec-kit/runtime/cli/lib/coverage-graph-convergence.cjs"
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts"
      - ".opencode/skills/system-spec-kit/runtime/cli/tests/tree-thinning.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-residue-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-spec-kit-residue |
| **Status** | Complete |
| **Completed** | 2026-09-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nine recorded decisions went in, three pieces of code came out, and the difference is the point.
Five of the nine would have edited files that `049-memory-decommission` deletes outright, so
they are closed as superseded with the paths that prove it rather than implemented into a tree
with a delete order against it. The rest are done: a family of tests that had been dark for three
and a half months runs again, the save-path CLI test stopped writing into the repository every
time it ran, and the suite that could not finish was run to the end so its residue could be
counted rather than estimated. The count it had carried was 115. It is 181.

### Coverage-graph tests, restored

Four test files under `scripts/tests/` imported `../../mcp-server/lib/coverage-graph/*`, which
has not existed since the modules were renamed out of the memory server in May and moved again
in July. A static ESM import that cannot resolve kills the whole file, so each of the four
collected zero tests and reported as a failure with no diagnosis.

Three of them needed one changed import specifier each, because the subject was moved, not
deleted, and `system-deep-loop/runtime/lib/coverage-graph/` still exports every symbol they
name. The fourth, `session-isolation.vitest.ts`, also imported five `handlers/coverage-graph/*`
modules that were genuinely retired with no aliases and no relocated equivalent, so it was
deleted.

Forty-seven assertions came back. Two failed, and both were real drift that accumulated while
the tests were dark, an empty-graph verification rate and the direction of a review coverage
gap. They were written up as contract questions rather than silenced.

### The two contract questions, ruled

The operator ruled that the tests follow the producer, and that no `system-deep-loop` runtime
code changes. Both producers were read first, and both already document the behaviour the tests
were contradicting. `computeResearchClaimVerificationRateFromData` carries a doc comment saying
an empty claim set is a vacuous pass returning `1.0`, because scoring it `0` would raise a
blocker no unverified claim can clear and loop a converged graph forever.
`getCoverageGapRequirements` pairs `{ DIMENSION, outgoing }` with `{ FILE, incoming }`, and the
runtime's own `tests/unit/coverage-graph-query.vitest.ts:182` asserts that direction on purpose.
The cross-layer fixture's single `review-dimension --COVERS--> review-file` edge satisfies both
requirements at once, so the right expectation there is no gap at all.

Neither assertion was loosened. Each now states the current contract with its reason in a
one-line comment, and the empty-graph test was renamed to name the vacuous pass it checks. The
parity comment in `lib/coverage-graph-convergence.cjs` still pointed at the pre-move MCP handler
path, so that dangling pointer was repaired in the same pass. It is comment-only, in the file
both repaired tests load as their parity subject.

### A project root you can point somewhere else

`generate-context.ts`'s `main()` acquires a lock directory inside the packet it resolves and
rewrites the parent's pointer metadata. Its test named a packet that had been archived under a
different track, so the write guard rejected it and seven tests died on `process.exit(1)`. The
cheap fix, repoint the fixture at the packet's current home, would have turned seven tests
green by having every run mutate a real archived packet.

Instead `main()` now takes the project root the way it already takes `argv` and `stdinReader`:
a third parameter with today's value as its default. One assignment binds it into `CONFIG`
before parsing, which is enough because every resolver downstream already reads the root from
there. The test builds a throwaway packet under a temp root per case and deletes it afterwards.
Production behavior is unchanged, and the suite no longer depends on the shape of the real
`specs/` tree.


### The suite, run to the end

The sharded runner completed on 2026-09-03: twelve shards, every one reporting, 34 minutes and
0 seconds of wall time over 2,040 seconds of shard time, 989 modules. No shard exited 124, which
is the bound that used to end the run with nothing to read. The exit status is 1 because tests
fail, not because a shard was killed, and the runner's own comment says a timed-out shard has to
keep its non-zero status, so the two cases are told apart by the per-shard line rather than by
the exit code.

| Reading | Value |
|---------|-------|
| Shards | 12 of 12 reported, slowest 409s, fastest 76s |
| Test files | 98 failed \| 874 passed \| 16 skipped |
| Tests | 181 failed \| 14,744 passed \| 317 skipped \| 1 todo |
| Files failing at load, collecting no tests | 3 |
| Wall time | 34m00s, 22:42:18Z to 23:16:18Z |

Two-thirds of the corpus outlives the decommission. Of 98 failing files, 79 sit under
`mcp-server/`, 18 under `system-spec-kit/scripts/tests/` and one under
`system-deep-loop/runtime/tests/`. Of 181 failing tests, 150 are inside the delete and 31 are not.

### The residue, grouped

Every one of the 31 failures in a surviving tree belongs to one of fifteen mechanisms. A
mechanism here is a cause with a file and a line, not a family of similar error text.

| # | Mechanism | Failures | Worked example |
|---|-----------|----------|----------------|
| 1 | A temp workspace is not a faithful replica: the track folder carries no `graph-metadata.json`, so the save path's pointer rewrite throws | 1 | `phase-parent-pointer.vitest.ts` throws `ENOENT` at `scripts/memory/generate-context.ts:594`. ADR-008 fixed this in its own fixture and this sibling never got the same treatment |
| 2 | A test anchors on real repository paths whose packet has since renamed its children | 2 | `recursive-child-manifest.vitest.ts:14-25` names `036-deep-loop-innovation/016-whole-system-gate` and `.../001-deep-loop-market-research`. The children are now `016-system-deep-loop-review` and `001-research-inputs-and-architecture`, so one spawn returns 127 and one read returns `ENOENT` |
| 3 | A write-authorization guard refuses the temp packet root the test writes into | 4 | `multi-ai-council-persist-artifacts.vitest.ts`, where `assertAuthorizedPacketRoot` at `deep-ai-council/scripts/lib/persist-artifacts.cjs:552` rejects `/var/folders/…/ai-council-persist-*` |
| 4 | The deep-research strategy-anchor contract moved under its tests, in both directions | 5 | `graph-aware-stop.vitest.ts` ×4, where `reduce-state.cjs:2563` throws `Missing insertion anchor carried-forward-open-questions`. `review-reducer-fail-closed.vitest.ts` ×1 expects a throw for a missing machine-owned anchor and gets none |
| 5 | The templates tree moved out of `manifest/` and two resolver tests still assert that layout | 2 | `template-structure.vitest.ts` expects `templates/manifest/plan.md.tmpl` and resolves `templates/core/plan.md.tmpl`. `review-record-validation.vitest.ts` expects `manifest/review.spec.md.tmpl` and resolves `packet-types/review.spec.md.tmpl` |
| 6 | An exact-literal assertion against a document its producer has since reformatted or reordered | 3 | `deep-review-auto-restart-contract.vitest.ts` asserts `config.stopPolicy: {stop_policy}`, and `deep-review-auto.yaml:459` now carries `stopPolicy: "{stop_policy}"` |
| 7 | The relative-path arm of the import guard spells the directory with an underscore the rename removed | 2 | At `import-policy-rules.ts:19` the `RELATIVE_INTERNAL_RUNTIME_IMPORT_RE` pattern matches `mcp_server/`, the directory is `mcp-server/`, so a relative import into that directory passes the guard. Corrected on 2026-09-04 after review: the same alternation also carries `shared`, and that half does match, so the arm is half-dead rather than dead |
| 8 | The phase-parent status rollup moved out of the backfill module into the save path | 2 | `graph-metadata-backfill.vitest.ts` expects `refreshGraphMetadataForSpecFolder` to roll a parent to `complete`, and `graph/backfill-graph-metadata.ts` holds no rollup, and `last_active_child_id` is written by `updatePhaseParentPointer` at `memory/generate-context.ts:602` |
| 9 | The repair tool plans work only for validator findings on its derivable allow-list, and the fixture produces none | 4 | `repair-derived.vitest.ts`, where `spec/repair-derived.cjs:330-332` returns `planned: []`. Reproduced independently on a replica fixture: `inspected=1 repairable=0 failed=0`, exit 0 |
| 10 | The `z_*` exclusion helper no longer changes behavior when its flag is turned off | 1 | `scoped-backfill-boundary.vitest.ts`, where the off state returns `false` where the prior scanner returned `true` |
| 11 | The scaffold-marker gate no longer classifies a marker as an error | 1 | `validation-gate-hardening.vitest.ts`, expected exit 2 and observed exit 0 |
| 12 | The prune report and the prune apply disagree by one retained child | 1 | `backfill-prune-report-gate.vitest.ts`, where the report predicts 1 retained, apply retains 0 |
| 13 | The generated-JSON migration is not byte-stable on a second run | 1 | `migrate-generated-json.vitest.ts`, where the hash list differs at `911-parent/description.json` |
| 14 | The constitutional tier's decay rate is no longer the no-decay constant | 1 | At `test-integration.vitest.ts:195`, `getDecayRate('constitutional')` returns 0.8 where the export-parity contract asserts 1 |
| 15 | The cli-pi adapter's thinking level was renamed | 1 | At `fanout-run.vitest.ts:1541` the adapter passes `--thinking xhigh`, the test asserts `max` |

Nine of the fifteen are one mechanism with several symptoms rather than several bugs. Group 4 is
five failures from one contract, group 9 is four from one gate, and group 3 is four from one
guard, which is why a signature-level grouping would have read as fifteen unrelated numbers
instead.

The other 150 failures, and the 3 files that fail at load and collect no tests, sit under
`mcp-server/`. They are counted and attributed, not diagnosed, for the reason ADR-009 records.
Twenty-eight of them are already ruled by name:

| Recorded decision | Failing file | Failures |
|-------------------|--------------|----------|
| ADR-001, the BM25 default | `search-extended.vitest.ts`, `bm25-index.vitest.ts` | 7 |
| ADR-002, channel representation | `channel-representation.vitest.ts`, `channel-enforcement.vitest.ts` | 5 |
| ADR-003, `enforceSearchTokenBudget` | `memory-search-token-budget.vitest.ts` | 5 |
| ADR-004, the `anchor_id` fixture | `incremental-index-move-reconcile.vitest.ts` | 6 |
| ADR-007, the database resolver | `memory-roadmap-flags.vitest.ts`, `db-lifecycle-paths.vitest.ts` | 5 |

ADR-001 names two of its seven by id, BM01 and T037.2. The other five assert results from the
same lane the flag turns off. The remaining 122 failing tests and 3 load failures under
`mcp-server/` carry a count and a file and nothing more.

### The references that do not resolve

The count that stood at 25 is 48, and it splits the same way. `mcp-server/tsconfig.tests.json` is
the only config in the workspace that compiles a test file, and it covers `mcp-server/` alone:
`npm run typecheck:tests` reports 21 `TS2304` findings there, 13 distinct names across 5 files,
all inside the delete.

The surviving trees have no lane at all. `scripts/tsconfig.json` lists no `tests/` entry in
`include`, and `system-deep-loop/runtime/tsconfig.json` carries `tests/**/*.ts` in `exclude`.
Compiling them under a copy of the mcp-server tests config found 27 more findings in
`system-spec-kit/scripts/tests/` and none in the deep-loop runtime tests. Those 27 are fixed:
20 annotations naming `FileEntry`, which `core/tree-thinning.ts:45` exports and the file never
imported, and 7 naming `ProgressiveValidateReport`, a report shape whose producer is a shell
script and which nothing declared. The tree went from 496 type errors to 469, which is 496 minus
exactly the 27, and both edited files now contribute zero.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Modified | Repoint one import at the deep-loop runtime. Correct the stale layer name in the header |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/coverage-graph-cross-layer.vitest.ts` | Modified | Repoint three imports at the deep-loop runtime. Align the two drifted expectations with their producers |
| `.opencode/skills/system-spec-kit/runtime/cli/lib/coverage-graph-convergence.cjs` | Modified | Repoint the stale parity comment at the deep-loop runtime. Comment only |
| `.opencode/skills/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts` | Modified | Repoint one import at the deep-loop runtime |
| `.opencode/skills/system-spec-kit/scripts/tests/session-isolation.vitest.ts` | Deleted | Depends on five MCP handler modules retired with no relocated equivalent |
| `.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modified | `main()` takes a defaulted project root and binds it before parsing |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/generate-context-cli-authority.vitest.ts` | Modified | Fixture becomes a throwaway packet under a temp root, track metadata included |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/tree-thinning.vitest.ts` | Modified | Import the `FileEntry` alias twenty annotations already name |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts` | Modified | Declare the report shape the validation script prints, and mark three deferred assignments |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/decision-record.md` | Modified | Nine resolutions, three outcomes, the daemon-recycle entry, seven adjacent findings |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/tasks.md` | Modified | Real task ledger and verification checklist |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/acceptance-criteria.md` | Modified | AC-004 met, AC-005 and AC-006 added, closure statement written |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/spec.md` | Modified | Status, scope and files-to-change reconciled |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/implementation-summary.md` | Modified | This document |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/goal.md` | Modified | Log updated with the dispositions and the evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each ADR was checked path by path against the `Delete` list in
`049-memory-decommission/003-spec-memory-server-removal/spec.md` §3 before any edit, and every
subject path was confirmed to exist on disk first, so the supersession rests on the current tree
rather than on the ADR's own prose.

Both implemented decisions were run red first with the workspace's own vitest invocation
(`npx vitest run --config ../mcp-server/vitest.config.ts <file>` from `scripts/`), so the same
command proves the change. Output and exit status were read on every run.

The residue came from `npm run test:sharded` in `mcp-server/`, redirected to a file and read
rather than piped, because a run this long tells you nothing through an exit code alone. One
hypothesis was tested and rejected before the grouping started: a stale `dist/` would have
explained a whole family at once, and the scripts workspace did carry eight sources newer than
their compiled output. Rebuilding it changed nothing, `Tests 12 failed \| 43 passed (56)` before
and after across the seven suspect files, so the drifts are in the sources.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Supersede rather than implement five ADRs | Every file they would edit is inside the 1,480-file `mcp-server/` tree that 049 deletes. A green check the delete throws away is not worth the edit, and 049 being Draft does not change that |
| Bind the injected root through `CONFIG` rather than thread a parameter | Four downstream resolvers already read the root from `CONFIG`, which the module documents as mutable runtime config. Threading would have changed four exported helpers to serve one seam |
| Give the ADR-008 fixture a track-level `graph-metadata.json` | A track folder holding `NNN-` children is a phase parent, so the save path rewrites its pointers. Without that file the temp workspace was not a faithful replica and the run failed on ENOENT |
| Leave the two repointed failures red | They are genuine drift in a tree outside this scope, and which side is right is a contract question. Editing the assertions would have written the drift down as the specification |
| Group the surviving 31 failures and only count the deleted 150 | A mechanism costs a producer read and sometimes a reproduction. Spending that on code with a delete order against it buys a diagnosis that the delete takes back |
| Import the `FileEntry` alias rather than rewrite twenty annotations | The name is real and exported. The defect was a missing import, so the smallest true fix is the import |
| Declare the progressive-validate report shape inside its test | Its producer is a shell script, so no module in the workspace can own that contract, and a type declared anywhere else would drift from the script that prints it |
| Leave the surviving trees without a tests typecheck lane | They report 469 and 283 non-reference type errors. A lane switched on today is red on its first run, which is the state its own config documents as the reason to report rather than enforce |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ADR-005 baseline, four files | FAIL as expected, `Test Files 4 failed (4)`, `Tests no tests`, each `Cannot find module '../../mcp-server/lib/coverage-graph/…'` |
| ADR-005 after repoint, three files | `Test Files 1 failed \| 2 passed (3)`, `Tests 2 failed \| 47 passed (49)`. The two failures are adjacent findings A1 and A2 |
| A1 and A2, three files plus the ADR-008 control | PASS, `Test Files 4 passed (4)`, `Tests 60 passed (60)`, exit 0 |
| Deep-loop runtime coverage-graph suite, query, signals and db | PASS, `Tests 42 passed (42)`, exit 0. Runtime assertions unchanged |
| ADR-008 baseline | FAIL as expected, `Tests 7 failed \| 4 passed (11)`, all seven `process.exit unexpectedly called with "1"` |
| ADR-008 after change | PASS, `Tests 11 passed (11)`, exit 0 |
| `npm run typecheck` (`system-spec-kit/scripts`) | PASS, exit 0 |
| Repository writes from the ADR-008 suite | None. `git status` shows no lock directory and no packet metadata churn from the run |
| `npm run test:sharded` (`mcp-server`), whole suite | COMPLETE. 12 of 12 shards reported, 34m00s wall, `Tests 181 failed \| 14744 passed \| 317 skipped \| 1 todo`, exit 1 from failures rather than a bound. No shard exited 124 |
| `npm run typecheck:tests` (`mcp-server`) | 21 `TS2304` findings, 13 names, 5 files, all inside 049's delete |
| Surviving `scripts/tests/` compiled under a copy of that config | 27 `TS2304` before, 0 after. Total errors 496 to 469, the difference exactly the 27 |
| Surviving `system-deep-loop/runtime/tests/` under the same treatment | 0 `TS2304`, 283 other errors |
| Stale-`dist` hypothesis, safe negative control | REJECTED. Rebuilt the scripts workspace, re-ran the seven suspect files, `Tests 12 failed \| 43 passed (56)` unchanged |
| The two edited test files, inside the sharded run | PASS. `tree-thinning` 28 tests in shard 10, `progressive-validation` 52 tests in shard 11, both after the edits landed |
| Repository writes from the whole-suite run | 20 generated metadata files under `specs/` were rewritten by the run and restored. The writer is `mcp-server/lib/search/folder-discovery.ts`, inside the delete |
| `validate.sh --strict` on this folder | PASS, `RESULT: PASSED`, `Errors: 0  Warnings: 0`, 36 rules printed |
| `validate.sh --strict --recursive` on the packet | PASS, `RESULT: PASSED` for all 8 folders, every one `Errors: 0`. The parent carries one pre-existing warning, `AI_PROTOCOL incomplete` |
| `hvr_scan.py` on the phase documents | 0 hard blockers in six of seven. `decision-record.md` carries 68 in prose authored in an earlier pass, against a baseline of 69 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Six documents still print the pre-move coverage-graph path.** Only the parity comment in
   `lib/coverage-graph-convergence.cjs` was repaired. The prose copies are recorded, not fixed.
2. **No typecheck lane covers a surviving test file.** `scripts/tsconfig.json` names no `tests/`
   entry and `system-deep-loop/runtime/tsconfig.json` excludes `tests/**/*.ts`, so every test edit
   in this phase was proven by running it. The lane that would catch this class is inside the
   delete. Adjacent finding A4, now with the numbers that say why turning one on is its own job.
3. **The suite writes into the repository.** A whole-suite run rewrote `specs/descriptions.json`
   and 19 per-packet `description.json` files. They were restored, and the writer goes with 049,
   but until then a run leaves the working tree dirty.
4. **A timed-out `main()` can cascade.** On a loaded machine one combined run had the first
   CLI-authority test exceed the 30s bound during module import, and its still-running `main()`
   left a canonical save lock that failed the next test. A rerun of the same four files finished
   in 8 seconds with 58 of 60 passing. The window is new, because before this change `main()`
   aborted at the write guard and never took a lock. It is a flake under contention, not a
   failure of the fixture, and it is recorded rather than engineered around.
5. **Five ADRs are closed without their fix.** If 049 is abandoned, ADR-001 to ADR-004 and
   ADR-007 come back with their decisions intact, the resolutions deliberately keep the
   operator's decision text.
6. **The 150 failures inside the delete carry a count, not a diagnosis.** If 049 is abandoned they
   come back undiagnosed, in the same position the five superseded ADRs leave their subjects.
<!-- /ANCHOR:limitations -->

---


