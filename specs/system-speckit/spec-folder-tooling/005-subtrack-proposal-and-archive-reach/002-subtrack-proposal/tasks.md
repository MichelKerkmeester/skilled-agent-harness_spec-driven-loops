---
title: "Tasks: Phase 2: subtrack-proposal"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "subtrack proposal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: subtrack-proposal

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

`K` is `.skilled/skills/system-spec-kit`. `S` is `$K/runtime/cli/spec/suggest-subtracks.mjs`. `FLAT` is the fixture track `demo` with 10 live packets, because no real flat track holds 8 or more. `CLONE` is the throwaway `git clone --shared` under `/private/tmp` that held `demo`, deleted after the runs.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pick `FLAT` and record its name and packet count, a fixture because the largest real flat track, `cli-classifier`, holds 6 live packets (`goal.md` section 4 of this phase). Verify: `rg -c "FLAT track" goal.md` prints 1.
- [x] T002 Inventory every file that pins the spec gate wording (`$K/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Verify: `rg -l "GATE_3_QUESTION|GATE_3_CHOICE_RELATED|GATE_3_MUTATION_NOTICE" .skilled` prints the list saved to `scratch/gate-consumers.txt`.
- [x] T003 Reuse the test baseline that phase 001 captured and closed on unchanged (`../001-relocation-engine/scratch/baseline.txt`). Verify: the file holds the `npm test` exit status and the pass and fail counts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the CLI with `--track`, `--threshold` and `--describe`, reading tracks through `readWorkingTreeTracks` (`$S`). Verify: `node $S --track does-not-exist` exits 2 and names the track.
- [x] T005 Add clustering by overlap of `description.json` keywords and `graph-metadata.json` `trigger_phrases` and `key_topics` (`$S`). Verify: in `CLONE`, `node $S --track demo` exits 0 and prints a JSON map that `relocate.mjs --map` reads.
- [x] T006 Add the whole-track map output with candidate subtrack names from shared terms and one remainder cluster named `general` (`$S`). Verify: in `CLONE`, the map holds 10 `from` entries for the 10 live packets of `demo`.
- [x] T007 Add the threshold of 8 and the `--threshold <n>` override (`$S`). Verify: `node $S --track cli-classifier` prints that the track is below the threshold of 8 and no map, and `--threshold 3` prints a 6-entry map.
- [x] T008 Add present mode for `--track <track> --describe "<text>"` (`$S`). Verify: `node $S --track system-speckit --describe "archive a spec folder"` prints one existing subtrack name or `none fits`.
- [ ] T009 Add the advisory stderr line as `advise_sub_track`, called right after `list_recent_track_packets` (`$K/runtime/cli/spec/create.sh`). Verify: `bash -n $K/runtime/cli/spec/create.sh` exits 0 and a `--json` run in a scratch tree prints stdout that `node -e` parses.
- [x] T010 Add the subtrack clause to `GATE_3_CHOICE_RELATED`, `GATE_3_QUESTION` and `GATE_3_MUTATION_NOTICE` (`$K/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Verify: `rg -c -i "subtrack|sub-track" $K/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` prints 3 or more.
- [x] T011 [P] Add the clause to option C (`.skilled/commands/speckit/assets/speckit-plan-presentation.txt`). Verify: `rg -c -i "subtrack|sub-track" .skilled/commands/speckit/assets/speckit-plan-presentation.txt` prints 1 or more.
- [x] T012 [P] Add the clause to option C (`.skilled/commands/speckit/assets/speckit-complete-presentation.txt`). Verify: `rg -c -i "subtrack|sub-track" .skilled/commands/speckit/assets/speckit-complete-presentation.txt` prints 1 or more.
- [x] T013 [P] Add the clause to Gate 3 option C (`AGENTS.md`). Verify: `rg -n -i "sub-track|subtrack" AGENTS.md` prints the option C line.
- [x] T014 Add the "when to propose a subtrack" section beside "Sub-Track Folders" (`$K/references/structure/folder-structure.md`). Verify: `rg -c -i "when to propose a sub-?track" $K/references/structure/folder-structure.md` prints 1.
- [x] T015 [P] Add the pointer in section 2 (`$K/references/structure/phase-definitions.md`). Verify: `rg -c "folder-structure.md" $K/references/structure/phase-definitions.md` prints 1 or more.
- [x] T016 [P] Document `--track <track>/<sub>` (`$K/SKILL.md`). Verify: `rg -c -e "--track <track>/<sub>" $K/SKILL.md` prints 1 or more.
- [x] T017 [P] Document `--track <track>/<sub>` (`$K/references/workflows/quick-reference.md`). Verify: `rg -c -e "--track <track>/<sub>" $K/references/workflows/quick-reference.md` prints 1 or more.
- [x] T022 Carry the option C clause to every other surface that copies it, by operator decision during the build (`scratch/gate-consumers.txt` lists them). Verify: the spec-gate-core and gate-3-menu-parity node tests print 124 pass and 0 fail, and `agents-md-manifest.cjs --check` prints PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Feed the `FLAT` map to the relocation preflight (`$K/runtime/cli/spec/relocate.mjs`). Verify: in `CLONE`, `node $K/runtime/cli/spec/relocate.mjs --map <map>` on the `demo` map exits 1 and prints `moves=10 moved=0`.
- [x] T019 Confirm the tool is read-only (`$S`). Verify: on the real tree, `git status --porcelain` prints the same lines before and after both modes run.
- [x] T020 Rerun the full suite and compare with the baseline (`../001-relocation-engine/scratch/baseline.txt`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline.
- [x] T021 Validate this phase folder (`spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh . --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [x] The `demo` fixture map passed the `relocate.mjs` preflight in `CLONE`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with its reason in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Phase 001 handed off and `relocate.mjs` exists
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `$S` parses: node ran it to exit 0 in the map, threshold and present-mode runs
- [ ] CHK-011 [P0] `bash -n $K/runtime/cli/spec/create.sh` exits 0. Not observed: no run of this command is on record
- [x] CHK-012 [P1] A missing track exits 2 with the track name
- [x] CHK-013 [P1] No code comment names a spec path, a task id or a requirement id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Open: AC-007 is `Unmet`
- [x] CHK-021 [P0] The `FLAT` map passed the `relocate.mjs` preflight in `CLONE` with exit 1
- [x] CHK-022 [P1] A track below the threshold prints no map
- [ ] CHK-023 [P1] `create.sh --json` stdout still parses with the advisory line present. Not observed: the recorded `create.sh --track demo` run did not use `--json`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase builds a new tool and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `$S` reads no credential and no `.env` file
- [x] CHK-031 [P0] Control characters are stripped from packet metadata before it is printed. By reading `$S`: `termsOf` keeps only runs of `a-z` and `0-9`, and the map is printed through `JSON.stringify`
- [x] CHK-032 [P1] N/A: the tool has no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The option C clause `new or existing sub-track` reads the same in `spec-gate-core.mjs`, `speckit-implement.yaml` and both presentation assets. `AGENTS.md` option C names a sub-track in its own longer sentence
- [ ] CHK-042 [P2] `$K/runtime/cli/spec/README.md` lists `suggest-subtracks.mjs`. Deferred: the README does not name the tool
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No emitted map is kept in the repository. The fixture map lived in `CLONE` only, and the baseline is phase 001's `scratch/baseline.txt`
- [x] CHK-051 [P1] `scratch/` holds only `gate-consumers.txt`, the T002 inventory
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 6/8 |
| P1 Items | 10 | 9/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
