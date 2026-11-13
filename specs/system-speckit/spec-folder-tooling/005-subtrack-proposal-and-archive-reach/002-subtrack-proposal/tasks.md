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

`K` is `.skilled/skills/system-spec-kit`. `S` is `$K/runtime/cli/spec/suggest-subtracks.mjs`. `FLAT` is a real flat track with more than eight live packets, chosen in T001.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pick `FLAT` and record its name and packet count (`goal.md` section 4 of this phase). Verify: `rg -c "FLAT track" goal.md` prints 1.
- [ ] T002 Inventory every file that pins the spec gate wording (`$K/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Verify: `rg -l "GATE_3_QUESTION|GATE_3_CHOICE_RELATED|GATE_3_MUTATION_NOTICE" .skilled` prints the list saved to `scratch/gate-consumers.txt`.
- [ ] T003 Capture the test baseline before the first edit (`$K/runtime/cli/package.json`). Verify: `cd $K/runtime/cli && npm test` prints the pass and fail counts, saved to `scratch/baseline.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the CLI with `--track`, `--threshold` and `--describe`, reading tracks through `readWorkingTreeTracks` (`$S`). Verify: `node $S --track does-not-exist` exits 2 and names the track.
- [ ] T005 Add clustering by overlap of `description.json` keywords and `graph-metadata.json` `trigger_phrases` and `key_topics` (`$S`). Verify: `node $S --track FLAT` prints JSON that `node -e` parses.
- [ ] T006 Add the whole-track map output with candidate subtrack names from shared terms and one remainder cluster (`$S`). Verify: the count of `from` entries equals the live packet count of `FLAT`.
- [ ] T007 Add the threshold of 8 and the `--threshold <n>` override (`$S`). Verify: `node $S --track FLAT --threshold 9999` prints that the track is below the threshold and no map.
- [ ] T008 Add present mode for `--track <track> --describe "<text>"` (`$S`). Verify: `node $S --track system-speckit --describe "archive a spec folder"` prints one existing subtrack name or `none fits`.
- [ ] T009 Add one advisory stderr line to `list_recent_track_packets` (`$K/runtime/cli/spec/create.sh`). Verify: `bash -n $K/runtime/cli/spec/create.sh` exits 0 and a `--json` run in a scratch tree prints stdout that `node -e` parses.
- [ ] T010 Add the subtrack clause to `GATE_3_CHOICE_RELATED`, `GATE_3_QUESTION` and `GATE_3_MUTATION_NOTICE` (`$K/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`). Verify: `rg -c -i "subtrack|sub-track" $K/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` prints 3 or more.
- [ ] T011 [P] Add the clause to option C (`.skilled/commands/speckit/assets/speckit-plan-presentation.txt`). Verify: `rg -c -i "subtrack|sub-track" .skilled/commands/speckit/assets/speckit-plan-presentation.txt` prints 1 or more.
- [ ] T012 [P] Add the clause to option C (`.skilled/commands/speckit/assets/speckit-complete-presentation.txt`). Verify: `rg -c -i "subtrack|sub-track" .skilled/commands/speckit/assets/speckit-complete-presentation.txt` prints 1 or more.
- [ ] T013 [P] Add the clause to Gate 3 option C (`AGENTS.md`). Verify: `rg -n -i "sub-track|subtrack" AGENTS.md` prints the option C line.
- [ ] T014 Add the "when to propose a subtrack" section beside "Sub-Track Folders" (`$K/references/structure/folder-structure.md`). Verify: `rg -c -i "when to propose a sub-?track" $K/references/structure/folder-structure.md` prints 1.
- [ ] T015 [P] Add the pointer in section 2 (`$K/references/structure/phase-definitions.md`). Verify: `rg -c "folder-structure.md" $K/references/structure/phase-definitions.md` prints 1 or more.
- [ ] T016 [P] Document `--track <track>/<sub>` (`$K/SKILL.md`). Verify: `rg -c -e "--track <track>/<sub>" $K/SKILL.md` prints 1 or more.
- [ ] T017 [P] Document `--track <track>/<sub>` (`$K/references/workflows/quick-reference.md`). Verify: `rg -c -e "--track <track>/<sub>" $K/references/workflows/quick-reference.md` prints 1 or more.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Feed the `FLAT` map to the relocation preflight (`$K/runtime/cli/spec/relocate.mjs`). Verify: `node $S --track FLAT > scratch/flat-map.json` then `node $K/runtime/cli/spec/relocate.mjs --map scratch/flat-map.json` exits 1.
- [ ] T019 Confirm the tool is read-only (`$S`). Verify: `git status --porcelain` prints the same lines before and after both modes run.
- [ ] T020 Rerun the full suite and compare with the baseline (`scratch/baseline.txt`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline.
- [ ] T021 Validate this phase folder (`spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh . --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/flat-map.json` passed the `relocate.mjs` preflight
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 001 handed off and `relocate.mjs` exists
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check $S` exits 0
- [ ] CHK-011 [P0] `bash -n $K/runtime/cli/spec/create.sh` exits 0
- [ ] CHK-012 [P1] A missing track exits 2 with the track name
- [ ] CHK-013 [P1] No code comment names a spec path, a task id or a requirement id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The `FLAT` map passed the `relocate.mjs` preflight
- [ ] CHK-022 [P1] A track below the threshold prints no map
- [ ] CHK-023 [P1] `create.sh --json` stdout still parses with the advisory line present
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase builds a new tool and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `$S` reads no credential and no `.env` file
- [ ] CHK-031 [P0] Control characters are stripped from packet metadata before it is printed
- [ ] CHK-032 [P1] N/A: the tool has no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The option C clause reads the same in `spec-gate-core.mjs`, `AGENTS.md` and both presentation assets
- [ ] CHK-042 [P2] `$K/runtime/cli/spec/README.md` lists `suggest-subtracks.mjs`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The emitted map and the baseline live in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
