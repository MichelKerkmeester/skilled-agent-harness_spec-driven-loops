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

- [ ] T001 Save the Measured Behavior commands and their output (`scratch/baseline.txt`). Verify: `rg -c '11' scratch/baseline.txt` prints 1 or more.
- [ ] T002 List every current roster row for each of the four rosters (`scratch/row-parity.md`). Verify: `rg -c '^\| ' scratch/row-parity.md` prints 30 or more.
- [ ] T003 Confirm the operator's answer to the first open question is recorded (`spec.md`). Verify: `rg -c 'Operator answer:' spec.md` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the registry with eleven records (`.skilled/agents/agent-registry.json`). Verify: `node -e "console.log(require('./.skilled/agents/agent-registry.json').agents.length)"` prints 11.
- [ ] T005 Create the script with a write mode and a `--check` mode (`.skilled/bin/sync-agent-roster.cjs`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 1 and names four missing blocks.
- [ ] T006 Add the test file with the happy path, the missing-record case, the hand-edit case and the stale README case (`.skilled/bin/sync-agent-roster.vitest.ts`). Verify: `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports 4 passed.
- [ ] T007 Convert the routing table to a generated block and run the mirror check before going on (`.skilled/agents/orchestrate.md`). Verify: `rg -c '@design' .skilled/agents/orchestrate.md` prints 1 or more.
- [ ] T008 Convert the leaf list and the agent files table to generated blocks (`.skilled/agents/orchestrate.md`). Verify: `rg -c '@prompt-improver' .skilled/agents/orchestrate.md` prints 3 or more.
- [ ] T009 Convert the roster to a generated block (`.skilled/agents/README.txt`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0.
- [ ] T010 Add the check step to the workflow (`.github/workflows/agent-mirror-sync.yml`). Verify: `rg -c 'sync-agent-roster.cjs --check' .github/workflows/agent-mirror-sync.yml` prints 1.
- [ ] T011 Regenerate the runtime copies of every changed agent file by the route `.skilled/bin/agent-mirror-crosswalk.md` names for each tree (`.claude/agents`, `.codex/agents`, `.pi/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Compare each agent's registry tier with its own file (`scratch/tier-parity.md`). Verify: `rg -c 'agrees$' scratch/tier-parity.md` prints 11.
- [ ] T013 Run the write mode twice and confirm the second run changes nothing (`.skilled/agents/orchestrate.md`). Verify: `git diff --stat` prints nothing after the second run.
- [ ] T014 Time the check (`scratch/after.txt`). Verify: `time node .skilled/bin/sync-agent-roster.cjs --check` reports under 2 seconds real.
- [ ] T015 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 and `rg -c '@design' .skilled/agents/orchestrate.md` prints 3 or more
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

- [ ] CHK-001 [P0] Requirements are in `spec.md` section 4 and each has a row in `acceptance-criteria.md`
- [ ] CHK-002 [P0] The baseline in `spec.md` Measured Behavior was rerun and saved to `scratch/baseline.txt`
- [ ] CHK-003 [P1] Phase 1's `acceptance-criteria.md` says `Closeable: Yes`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/bin/sync-agent-roster.cjs` exits 0
- [ ] CHK-011 [P0] The quality runner `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .skilled/bin/sync-agent-roster.cjs` reports no blocker
- [ ] CHK-012 [P1] The script catches only the JSON parse error and the missing-file error, and exits 2 on both
- [ ] CHK-013 [P1] No code comment names a spec path, a packet number or a task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] REQ-001 to REQ-004 hold as `acceptance-criteria.md` states
- [ ] CHK-021 [P0] `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed
- [ ] CHK-022 [P1] REQ-005 to REQ-008 hold as `acceptance-criteria.md` states
- [ ] CHK-023 [P1] An invalid JSON registry makes both modes exit 2
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported defect class beyond the rows in the Testing Checklist.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The script reads and writes only under `.skilled/agents/`: `rg -n 'writeFileSync' .skilled/bin/sync-agent-roster.cjs` shows no other root
- [ ] CHK-031 [P1] The script spawns no process: `rg -n 'child_process' .skilled/bin/sync-agent-roster.cjs` prints no line
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same three new files
- [ ] CHK-041 [P1] `.skilled/bin/README.md` lists the new script and both modes
- [ ] CHK-042 [P2] `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` tells an author to add a registry record with a new agent
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines, parity tables and removal maps live under `scratch/` only
- [ ] CHK-051 [P1] `git status --short` lists no file outside the paths in `spec.md` Files to Change and this packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 7 | 0/7 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



