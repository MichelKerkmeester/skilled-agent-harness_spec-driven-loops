---
title: "Tasks: Phase 2: agent-registry-and-generated-rosters"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agent registry and generated rosters tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: agent-registry-and-generated-rosters

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

**Variables**: `A` is `.skilled/agents`. `R` is `.skilled/agents/agent-registry.json`. `S` is `.skilled/bin/sync-agent-roster.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the Measured Behavior commands and their output (`scratch/baseline.txt`). Verify: `rg -c '11' scratch/baseline.txt` prints 1 or more.
- [x] T002 List every current roster row for each of the four rosters (`scratch/row-parity.md`). Verify: `rg -c '^\| ' scratch/row-parity.md` prints 30 or more.
- [x] T003 Confirm the operator's answer to the first open question is recorded (`spec.md`). Verify: `rg -c 'Operator answer:' spec.md` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the registry with eleven records (`.skilled/agents/agent-registry.json`). Verify: `node -e "console.log(require('./.skilled/agents/agent-registry.json').agents.length)"` prints 11.
- [x] T005 Create the script with a write mode and a `--check` mode (`.skilled/bin/sync-agent-roster.cjs`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 1 and names four missing blocks.
- [x] T006 Add the test file with the happy path, the missing-record case, the hand-edit case and the stale README case (`.skilled/bin/sync-agent-roster.vitest.ts`). Verify: `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports 4 passed.
- [x] T007 Convert the routing table to a generated block and run the mirror check before going on (`.skilled/agents/orchestrate.md`). Verify: `rg -c '@design' .skilled/agents/orchestrate.md` prints 1 or more.
- [x] T008 Convert the leaf list and the agent files table to generated blocks (`.skilled/agents/orchestrate.md`). Verify: `rg -c '@prompt-improver' .skilled/agents/orchestrate.md` prints 3 or more.
- [x] T009 Convert the roster to a generated block (`.skilled/agents/README.txt`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0.
- [x] T010 Add the check step to the workflow (`.github/workflows/agent-mirror-sync.yml`). Verify: `rg -c 'sync-agent-roster.cjs --check' .github/workflows/agent-mirror-sync.yml` prints 1.
- [x] T011 Regenerate the runtime copies of every changed agent file by the route `.skilled/bin/agent-mirror-crosswalk.md` names for each tree (`.claude/agents`, `.codex/agents`, `.pi/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Compare each agent's registry tier with its own file (`scratch/tier-parity.md`). Verify: `rg -c 'agrees$' scratch/tier-parity.md` prints 11.
- [x] T013 Run the write mode twice and confirm the second run changes nothing (`.skilled/agents/orchestrate.md`). Verify: `git diff --stat` prints nothing after the second run.
- [x] T014 Time the check (`scratch/after.txt`). Verify: `time node .skilled/bin/sync-agent-roster.cjs --check` reports under 2 seconds real.
- [x] T015 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 and `rg -c '@design' .skilled/agents/orchestrate.md` prints 3 or more
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
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

A `[B]` task blocks close until its blocker is named in this file and the operator has answered it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are in `spec.md` section 4 and each has a row in `acceptance-criteria.md` Evidence: eight REQ rows and eight AC rows.
- [x] CHK-002 [P0] The baseline in `spec.md` Measured Behavior was rerun and saved to `scratch/baseline.txt` Evidence: `rg -c '11' scratch/baseline.txt` printed 1.
- [x] CHK-003 [P1] Phase 1's `acceptance-criteria.md` says `Closeable: Yes` Evidence: phase 1 `acceptance-criteria.md` line 88 reads `**Closeable:** Yes`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/bin/sync-agent-roster.cjs` exits 0 Evidence: the command exited 0.
- [x] CHK-011 [P0] The quality runner `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .skilled/bin/sync-agent-roster.cjs` reports no blocker Evidence: the runner printed `p0_blocking: 0`, `p1_open: 0`, `p2_open: 0`, an empty `errors` list, and exited 0.
- [x] CHK-012 [P1] The script catches only the JSON parse error and the missing-file error, and exits 2 on both Evidence: `rg -n 'catch|process.exit\(2\)'` shows two catch sites, the registry read and the JSON parse, each followed by exit 2. A third exit 2 is the unknown-option guard.
- [x] CHK-013 [P1] No code comment names a spec path, a packet number or a task id Evidence: `rg -n -i -e 'specs/' -e 'REQ-' -e 'T0[0-9][0-9]' -e 'CHK-' -e 'phase [0-9]'` over both new files printed no line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] REQ-001 to REQ-004 hold as `acceptance-criteria.md` states Evidence: see AC-001 to AC-004.
- [x] CHK-021 [P0] `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed Evidence: `vitest run --root .skilled --config vitest.config.bin.ts bin/sync-agent-roster.vitest.ts` printed `Tests 4 passed (4)`. The bare `npx vitest run <path>` form finds no file, because the bin tests run through `.skilled/vitest.config.bin.ts`.
- [x] CHK-022 [P1] REQ-005 to REQ-008 hold as `acceptance-criteria.md` states Evidence: see AC-005 to AC-008.
- [x] CHK-023 [P1] An invalid JSON registry makes both modes exit 2 Evidence: a temp tree with `{bad` as the registry: write mode exited 2 and check mode exited 2, each printing the parse error.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported defect class beyond the rows in the Testing Checklist.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The script reads and writes only under `.skilled/agents/`: `rg -n 'writeFileSync' .skilled/bin/sync-agent-roster.cjs` shows no other root Evidence: one `writeFileSync` call, line 193, whose path comes from the two constants under `.skilled/agents/`.
- [x] CHK-031 [P1] The script spawns no process: `rg -n 'child_process' .skilled/bin/sync-agent-roster.cjs` prints no line Evidence: the search printed no line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same three new files Evidence: the three documents name `agent-registry.json`, `sync-agent-roster.cjs` and `sync-agent-roster.vitest.ts`.
- [x] CHK-041 [P1] `.skilled/bin/README.md` lists the new script and both modes Evidence: `rg -c 'sync-agent-roster' .skilled/bin/README.md` printed 2: the tree line and the command row naming both modes.
- [ ] CHK-042 [P2] `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` tells an author to add a registry record with a new agent Deferred: the parent spec puts skill files out of scope for this phase, and phase 5 edits the agent template in that skill. Raised in `implementation-summary.md` Known Limitations.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines, parity tables and removal maps live under `scratch/` only Evidence: four files, all under `scratch/`.
- [x] CHK-051 [P1] `git status --short` lists no file outside the paths in `spec.md` Files to Change and this packet Evidence: `git status --short` lists only the paths in `spec.md` Files to Change, the generated copies and this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 0/1, deferred |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



