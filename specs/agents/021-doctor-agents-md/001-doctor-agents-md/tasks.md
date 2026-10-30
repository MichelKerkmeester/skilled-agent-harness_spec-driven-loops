---
title: "Tasks: /doctor:agents-md"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md phase tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: /doctor:agents-md

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

**Scope.** This list is the cross-child sequencing and the aggregate gate. Each child's own `tasks.md` owns its file-level work; nothing here repeats it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `/doctor:sk-skill` is on the start branch (`.skilled/commands/doctor/sk-skill.md`). Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit.
- [ ] T002 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'routes validated' scratch/baseline.txt` prints at least `1`.
- [ ] T003 Confirm all five child folders carry spec, plan, tasks and criteria (`001-manifest-and-template-block` to `005-verification-and-docs`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Close child 001 (`001-manifest-and-template-block/`). Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0.
- [ ] T005 Close child 002 (`002-check-engine/`). Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 with `STATUS=OK`.
- [ ] T006 Close child 003 (`003-embed-engine/`). Verify: `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` prints `NOTHING TO DO`.
- [ ] T007 Close child 004 (`004-command-plumbing/`). Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the three routes.
- [ ] T008 Close child 005 (`005-verification-and-docs/`). Verify: the nine transcripts exist and the two manual rows carry an answer or a recorded unknown.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Rerun every baseline command from the final tree (`scratch/baseline.txt`). Verify: each prints its pre-work pass line.
- [ ] T010 Run the recursive phase gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`.
- [ ] T011 Confirm the change list (`git status --porcelain`). Verify: the list names only the files the five children name.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every child's acceptance criteria read `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Children**: See the five child folders named by the Phase Documentation Map in `spec.md`
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

- [ ] CHK-001 [P0] The doctor sk-skill command is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit.
- [ ] CHK-002 [P0] The baseline is recorded. Verify: `rg -c 'check-rule-copies' scratch/baseline.txt` prints at least `1`.
- [ ] CHK-003 [P1] The five children validate. Verify: the recursive gate prints `RESULT: PASSED`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every child suite passes. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`.
- [ ] CHK-011 [P0] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-*.cjs` prints nothing.
- [ ] CHK-012 [P1] Every new file name is lowercase kebab. Verify: `git status --porcelain` lists no path with an uppercase letter.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`.
- [ ] CHK-021 [P0] The four suites pass. Verify: every `node --test` command named in `plan.md` reports `fail 0`.
- [ ] CHK-022 [P1] The pair agrees on every fixture. Verify: each of the nine transcripts pairs a state with the matching embed outcome.
- [ ] CHK-023 [P1] The canary still passes. Verify: `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No write leaves the allowlist. Verify: the embed suite's allowlist case passes with a refused path named.
- [ ] CHK-031 [P0] No credential reaches a tracked file. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/assets/agents-md-manifest.json` prints nothing.
- [ ] CHK-032 [P1] No consumer path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/scripts .skilled/commands/doctor/assets` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The phase spec and this list agree on the five children. Verify: `rg -c 'manifest-and-template-block' spec.md tasks.md` reports a count in each.
- [ ] CHK-041 [P1] The script README names the three scripts. Verify: `rg -c 'agents-md' .skilled/commands/doctor/scripts/README.markdown` prints at least `1`.
- [ ] CHK-042 [P2] The changelog entry exists. Verify: the file the sk-doc router resolved exists and names the command.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Transcripts and baselines live under `scratch/`. Verify: `find scratch -type f | wc -l` prints a non-zero count.
- [ ] CHK-051 [P1] No temporary fixture copy survives in the tree. Verify: `git status --porcelain` lists no temporary path.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
