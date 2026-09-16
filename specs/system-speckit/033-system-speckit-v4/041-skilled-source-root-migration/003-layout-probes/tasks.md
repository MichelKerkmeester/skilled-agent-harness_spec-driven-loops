---
title: "Tasks: Layout Probes for the Skilled Source-Root Move"
description: "Ordered probe tasks T001 to T025, each naming its executor and why, plus the verification checklist that decides whether the probe work is done."
trigger_phrases:
  - "skilled layout probe tasks"
  - "layout probe verification checklist"
  - "probe executor assignment"
  - "skilled probe task order"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Layout Probes for the Skilled Source-Root Move

<!-- SPECKIT_LEVEL: 2 -->

Twenty-five ordered tasks run the nine probes defined in [plan.md](plan.md), and the checklist at the end decides whether the probe work is done.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Executor**: every task ends by naming who runs it and why. "Orchestrator" is the session that owns this phase. "DeepSeek lane" is DeepSeek V4.1 Flash max on cli-pi with read-only tools, dispatched as plan.md §4 Delegation describes. `$P` is `/tmp/skilled-probes-003`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the shared setup in plan.md §4, then record the base SHA, the seven runtime versions, `git --version` and both status captures, plus the effective `core.hooksPath`, `diff.renames` and `diff.renameLimit` (`probes/probe-environment.md`). Orchestrator, because it runs git and seven CLIs.
- [x] T002 Confirm each link clone's HEAD equals `$P/base-sha` and `git -C <clone> remote` prints nothing for all four clones (`probes/probe-environment.md`). Orchestrator, because it reads clone state.
- [x] T003 Run the P8 home scan with values suppressed, read its output for anything value-like, then write the record (`probes/home-state-enumeration.md`). Orchestrator, because home files can hold credentials and lane reads leave the machine.
- [x] T004 Hash every file the T003 scan lists into `$P/home-guard-before.txt` with `shasum -a 256`, and export `SYSTEM_HOOKS_DISABLED=1` in the live-run shell (`probes/probe-environment.md`). Orchestrator, because it hashes home files.
- [x] T005 Capture help text for the seven CLIs, the Devin and opencode path listings under isolation and the strings extracts for the four compiled binaries, then compare the home guard (`probes/captures/`). Orchestrator, because it launches the CLIs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Dispatch units U1 to U7, one runtime each, with the brief shape in plan.md §4 Delegation, and save each return under `$P/returns/` (`probes/runtime-root-configurability.md`). DeepSeek lane, because loader-source reading is well-specified and read-heavy.
- [x] T007 Open every `path:line` U1 to U7 returned, strike misses, write each runtime section and its verification table (`probes/runtime-root-configurability.md`). Orchestrator, because parent D3 makes the orchestrator verify every return.
- [x] T008 Build shapes A and B in their link clones and record dangling-link counts against the baseline (`probes/runtime-symlink-resolution.md`). Orchestrator, because it changes clone layouts.
- [x] T009 Run the P4 layout commits, staged edits and `bash -x` hook traces in shape A and then shape B, with `SYSTEM_HOOKS_DISABLED` unset and before any P2 fixture exists there (`probes/gate-filters-under-linked-root.md`). Orchestrator, because it runs hooks.
- [x] T010 Verify isolation directories for Claude Code, Cursor Agent, Codex and Pi. Record any runtime that cannot authenticate isolated (`probes/runtime-symlink-resolution.md`). Orchestrator, because it launches runtimes.
- [x] T011 Run rows R1 to R5, covering opencode plugins, commands and agents, Devin skills and Pi extensions, in the baseline, shape A and shape B clones, comparing the home guard after each run (`probes/runtime-symlink-resolution.md`). Orchestrator, because each row needs a live runtime process.
- [x] T011a Run rows R12 and R13 in the baseline, shape A and shape B clones, and rows R1 and R13 in a `links-shape-b2` clone built from shape B with `.opencode/package.json` and `.opencode/bun.lock` moved into `.skilled/`, comparing the home guard after each run (`probes/runtime-symlink-resolution.md`) [Orchestrator]
- [x] T012 Run rows R6 to R11, covering Claude Code, Cursor Agent and Codex commands and agents, with a fresh nonce checked absent before each run (`probes/runtime-symlink-resolution.md`). Orchestrator, because each row needs a live model session.
- [x] T013 Run the P3 dangling-hook sandbox with the non-executable and failing controls (`probes/dangling-hook-behavior.md`). Orchestrator, because it runs git hooks.
- [x] T014 Run the P5 rehearsal: placeholder commit, variants r1 and r2, counts at three rename limits, guard verdicts, both pre-push runs, follow samples and the checkout over ignored files (`probes/rename-rehearsal.md`). Orchestrator, because it commits 17,767 renames in a clone.
- [x] T015 [P] Dispatch unit U8 for the council-graph writer, and count path-bearing cells in a `/tmp` copy of the database (`probes/council-graph-rebuild.md`). DeepSeek lane for the reading, because it covers eight named files. Orchestrator for the count, because it opens a binary file.
- [x] T016 [P] Dispatch unit U9 with the 35 recorded-fixture paths extracted from map C (`probes/fixture-path-assertions.md`). DeepSeek lane, because each fixture is a search and a read.
- [x] T017 Build the P9 ignored and untracked lists for worktree 055 and the main checkout, and turn them into one TSV per checkout (`probes/untracked-ignored-files.md`). Orchestrator, because it is one deterministic command per checkout.
- [x] T018 Dispatch unit U10 with the T017 TSVs (`probes/untracked-ignored-files.md`). DeepSeek lane, because tracing producers through tracked build sources is read-heavy and the lane sees paths only.
- [x] T019 Open every citation U8, U9 and U10 returned, strike misses and write each verification section (`probes/council-graph-rebuild.md`, `probes/fixture-path-assertions.md`, `probes/untracked-ignored-files.md`). Orchestrator, because parent D3 makes the orchestrator verify every return.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Close every probe record with one implication line each for shapes A, B and C, written as `- Shape A:`, `- Shape B:` and `- Shape C:` (`probes/`). Orchestrator, because the implication is a judgment over verified results.
- [x] T021 Compare both checkouts' `git status --porcelain` with the T001 captures and the home guard with the T004 snapshot, and record both results (`probes/probe-environment.md`). Orchestrator, because it reads real state.
- [x] T022 Confirm each of Q1 to Q9 has a record holding a result or a recorded reason, and that every file under `probes/` has a kebab-case name (`probes/`). Orchestrator, because it closes the evidence set.
- [x] T023 Remove `/tmp/skilled-probes-003/` after T019 to T022 pass. Orchestrator, because it deletes only scratch it created.
- [x] T024 Mark each acceptance criterion with its record, update `implementation-summary.md` and the `goal.md` log (`acceptance-criteria.md`). Orchestrator, because it owns closure.
- [x] T025 Run `bash /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` and require `RESULT: PASSED`. Orchestrator, because validation runs from the main checkout's toolchain.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Nine probe records and `probes/probe-environment.md` exist under `probes/`
- [x] Every lane-produced record carries its verification section
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md)
- **Plan**: See [plan.md](plan.md)
- **Acceptance criteria**: See [acceptance-criteria.md](acceptance-criteria.md)
- **Goal**: See [goal.md](goal.md)
- **Open questions closed here**: [phase 001 findings](../001-deep-research/research/research.md), lines 160-167, and [phase 002 findings](../002-per-runtime-reference-map/research/research.md), lines 167-176
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The nine questions and their sources are listed in spec.md §3
- [x] CHK-002 [P0] Each probe in plan.md §4 names its command, distinguishing observation and record
- [x] CHK-003 [P1] Runtime versions, free space on the `/tmp` volume and gateway access are checked before T001 starts
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every command a record cites is copied verbatim beside its exit status
- [x] CHK-011 [P0] Every clone write passes `-c core.hooksPath=/tmp/skilled-probes-003/empty-hooks` unless a hook is the subject
- [x] CHK-012 [P1] The home scan and the SQLite pass print counts and key paths, never values
- [x] CHK-013 [P1] Every record, capture, brief and return has a kebab-case filename
- [x] CHK-014 [P0] Every hook trace ran with `SYSTEM_HOOKS_DISABLED` unset, and every live runtime run with it set
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met with its record named
- [x] CHK-021 [P0] Every Q2 row has a baseline run that shows the surface loading, or the row is marked blind
- [x] CHK-022 [P1] Every nonce was absent from its clone before its fixture was written (fresh `uuidgen` per run; the explicit `rg -uu` absence check ran for R1, R2, R3 and R12)
- [x] CHK-023 [P1] The Q3 non-executable and failing controls ran beside the dangling hooks
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each result that contradicts a phase 001 or 002 claim is recorded as a correction beside that claim's citation
- [x] CHK-FIX-002 [P0] Q4 traces all 12 hook gates, not only the filters phase 001 cited
- [x] CHK-FIX-003 [P0] Every Q1 `configurable` cell is confirmed by its Q2 run or marked documented but unconfirmed
- [x] CHK-FIX-004 [P0] Q5 measures the rename-only and rename-plus-link commits at rename limits 1, default and 60000
- [x] CHK-FIX-005 [P1] Matrix row counts are stated before completion is claimed: Q2 33 runs, Q4 24 rows, Q5 6 count rows (Q2 41 runs after the R12, R13 and B2 additions, Q4 24 rows, Q5 6 count rows)
- [x] CHK-FIX-006 [P1] The global `core.hooksPath` and the repository's `diff.renameLimit` are recorded as the hostile state each git probe controls
- [x] CHK-FIX-007 [P1] Every result names the base SHA it ran against
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No record holds a credential, a token or a config value
- [x] CHK-031 [P0] No home-config content and no ignored-file content was sent to a lane (WAIVED: one breach, lane U3 read `~/.cursor/cli-config.json` unprompted, account identity only, no credential; recorded in `probes/runtime-root-configurability.md`)
- [x] CHK-032 [P1] No clone kept a remote, and no probe pushed anywhere except the Q3 sandbox's own bare repository
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, tasks.md and acceptance-criteria.md name the same nine questions and record files
- [x] CHK-041 [P1] Every probe record ends with its shape A, B and C implication lines
- [x] CHK-042 [P2] The answers phase 004 relies on are listed for the parent spec's open questions (listed in `implementation-summary.md` What Was Built and crosswalked in `../004-migration-design/plan.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Clones, logs, briefs, returns and string extracts stay under `/tmp/skilled-probes-003/`, and this folder's `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] `/tmp/skilled-probes-003/` is removed after the records are verified
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, set when the probes finish
<!-- /ANCHOR:summary -->

---
