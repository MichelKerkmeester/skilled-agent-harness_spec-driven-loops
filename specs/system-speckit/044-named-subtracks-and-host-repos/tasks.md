---
title: "Tasks: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index"
description: "Ordered, test-first tasks for declared sub-tracks in spec-kit's track tooling and three host-repository fixes, each with its verify command."
trigger_phrases:
  - "named subtracks and host repos tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`K` is `.skilled/skills/system-spec-kit/runtime`. `T` is the test command in `plan.md` section 5, run from `K/cli` after `npm run build` in `K`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline pass and fail counts of every test file in `T` (`scratch/baseline.txt`). Verify: `cat scratch/baseline.txt` shows one total per file. Evidence: 8 vitest files 145/145, doctor node tests 12 + 34 = 46/46.
- [x] T002 Add the shared sub-track fixture builder: a flat packet, a declared sub-track holding a numbered phase parent with one phase, its `z_archive/`, an undeclared folder and a symlinked sub-track (`K/cli/tests/fixtures/subtrack-tree.mjs`). Verify: the builder's own smoke test lists the six entries. Evidence: `subtrack-fixture.vitest.ts` 2/2.
- [x] T003 Add the red cases for REQ-001 to REQ-008 to the existing test files (`K/cli/tests/*.vitest.ts`). Verify: `T` prints the new cases failing and every baseline case passing. Evidence: red runs kept in `scratch/red-A.log` to `red-G.log`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Return declared sub-tracks with their immediate packets in both views, list them in their track's children, and report undeclared folders and skipped symlinked sub-tracks (`K/cli/lib/track-roots.mjs`). Verify: the `track-roots.vitest.ts` sub-track cases pass. Evidence: `track-roots.vitest.ts` 18/18.
- [x] T005 Accept `--track <track>/<sub-track>` (`K/cli/spec/refresh-track-roots.mjs`). Verify: the Measured Behavior reproduction exits 0 and `demo/sub/graph-metadata.json` lists `demo/sub/001-nested-probe`. Evidence: reproduction exits 0 and lists `demo/sub/001-nested-probe`; `demo/missing` exits 2.
- [x] T006 Sweep sub-tracks and print one diagnostic per undeclared folder, advisory only (`K/cli/spec/sweep-track-roots.mjs`). Verify: the sweep case prints the diagnostic and a flat tree still exits 0. Evidence: both views print one line per undeclared or symlinked folder and exit 0; the real repository keeps its old exit codes.
- [x] T007 Refresh the sub-track and its track instead of skipping a `/` value (`K/cli/spec/create.sh`). Verify: `create-track-refresh.vitest.ts` shows `demo/sub/002-*` in the sub-track's `children_ids` and `demo/sub` once in the track's. Evidence: `create-track-refresh.vitest.ts` 16/16.
- [x] T008 Exempt a declared sub-track folder as a container (`K/lib/validation/orchestrator.ts`). Verify: after `npm run build`, `validate.sh <fixture>/specs/demo/sub --strict` prints `RESULT: PASSED`. Evidence: `scratch/t019-reproduction.log`, `demo/sub --strict` RESULT: PASSED.
- [x] T009 Recurse through declared sub-tracks (`K/cli/spec/validate.sh`). Verify: `validate.sh <fixture>/specs/demo --recursive` lists `demo/sub/001-nested-probe`. Evidence: `validate-subtrack.vitest.ts` 4/4; the recursive run lists the nested packet at the same depth as a flat track's packets.
- [x] T010 Return the sub-track as `parent_id` for its packets (`K/lib/graph/graph-metadata-parser.ts`). Verify: `graph-metadata-refresh.vitest.ts` sub-track case passes. Evidence: `graph-metadata-refresh.vitest.ts` 7/7; a `create.sh` packet in `demo/sub` gets `parent_id: demo/sub`.
- [x] T011 Recompute `parent_id` after a move into or between sub-tracks (`K/cli/spec/repair-derived.cjs`). Verify: `repair-derived.vitest.ts` move cases pass with no `parent_id_review_required`. Evidence: `repair-derived.vitest.ts` 41/41, including a flat packet's parent and review flag left alone.
- [x] T012 Accept a sub-track as a packet home, archive into its `z_archive/` and refresh both levels (`K/cli/spec/archive.sh`). Verify: `archive-track.vitest.ts` sub-track cases pass. Evidence: `archive-track.vitest.ts` 60/60, including a sub-track name below a packet being refused and `--list` showing a sub-track archive.
- [x] T013 Add the `project_owned` manifest flag and the `project-owned` keep status (`.skilled/commands/doctor/scripts/symlink-engine.cjs`). Verify: `node --test` on `symlink-engine.test.cjs` proves the status and a byte-identical fixture file. Evidence: doctor node tests 50/50.
- [x] T014 Mark `.env.example` project-owned and make the install post-check accept it (`.skilled/commands/doctor/assets/symlink-manifest.json`). Verify: `doctor-symlink-contract.test.cjs` passes. Evidence: `doctor-symlink-contract.test.cjs` passes inside the 50/50 run.
- [x] T015 Tolerate a host with no `specs/` so no dangling `.skilled/specs` link remains (`.skilled/commands/doctor/scripts/symlink-engine.cjs`). Verify: the two fixture cases, with and without a host `specs/`, pass. Evidence: the two specs-alias cases pass; the operator chose the in-place build on 2026-11-07.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Document the sub-track level and host index mode (`K/../references/structure/folder-structure.md`). Verify: `rg -n 'sub-track' <file>` prints at least one line. Evidence: `rg -c sub-track` prints 16 lines; host index is section 7.
- [x] T017 Show the sub-track level and the explicit `--index` (`K/../README.md`, `.skilled/commands/speckit/search.md`, `K/data/README.md`). Verify: `rg -n 'sub-track|--index' <each file>` prints a line per file. Evidence: each of the three files prints at least one matching line.
- [x] T018 Run the full test set against the baseline (`scratch/baseline.txt`). Verify: `T` prints zero failures and the baseline totals plus the new cases. Evidence: packet set 178/178 vitest and 50/50 node; full cli 2346 passed, 0 failed; core 4243 passed, 0 failed.
- [x] T019 Run the Barter reproduction end to end in a scratch tree (`spec.md` Measured Behavior). Verify: recursive validation reaches the nested packet, the sub-track validates and refresh exits 0. Evidence: `scratch/t019-reproduction.log`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: T019 printed the three expected results
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
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

A blocked task is marked `[B]` with the reason on its line, and the packet stays open until it is unblocked or the operator defers it.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c 'REQ-0' spec.md` prints 12 Evidence: 12 unique REQ ids.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 3' plan.md` prints one line Evidence: `## 3. ARCHITECTURE` at line 52.
- [x] CHK-003 [P1] Packet 037's state of `graph-metadata-parser.ts` is checked: `git log -1 -- K/lib/graph/graph-metadata-parser.ts` names its latest commit Evidence: latest commit `7e07d19b93`; only `resolveParentId` and its caller changed.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run build` in `K` exits 0 after each TypeScript change Evidence: build exit 0 after the last TypeScript change.
- [x] CHK-011 [P0] `bash -n K/cli/spec/create.sh K/cli/spec/validate.sh K/cli/spec/archive.sh` exits 0 Evidence: exit 0.
- [x] CHK-012 [P1] A missing sub-track path exits 2 naming the path Evidence: `--track demo/missing` exits 2 naming the path.
- [x] CHK-013 [P1] The sk-code alignment checker passes on every changed file Evidence: alignment 0 errors and quality gate 0 findings on 19 files.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every new case failed before its change (T003 output kept in `scratch/`) Evidence: `scratch/red-A.log` to `red-G.log`; B was rerun against HEAD after the fact.
- [x] CHK-021 [P0] `T` prints zero failures (T018) Evidence: 178/178 and 50/50.
- [x] CHK-022 [P1] A flat-only fixture's metadata is byte-identical before and after Evidence: "keeps flat-tree metadata byte-identical after refresh" passes.
- [x] CHK-023 [P1] The undeclared folder and the symlinked sub-track each print one diagnostic Evidence: the both-views sweep case asserts one line each.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No change or test opens a `.env` file: `rg -n '\.env\b' <changed files>` shows only `.env.example` fixtures Evidence: no changed file names a `.env` path other than the `.env.example` manifest entry and fixtures.
- [x] CHK-031 [P0] A `--track` value with `..`, an absolute path or an empty segment is still refused by `validate_track_value` Evidence: `create-track-containment.vitest.ts` 11/11, now with an empty segment.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files Evidence: the three name the same files.
- [x] CHK-041 [P1] Code comments state the durable reason, with no packet or task ids Evidence: comment-hygiene check clean.
- [x] CHK-042 [P2] The four documents in T016 and T017 show the sub-track level Evidence: all four show it.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe trees and baselines live in `scratch/` only Evidence: probe trees lived in the session scratchpad, never in `scratch/`.
- [x] CHK-051 [P1] `scratch/` holds no probe tree at close Evidence: `scratch/` holds logs and the baseline only.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-07
<!-- /ANCHOR:summary -->
