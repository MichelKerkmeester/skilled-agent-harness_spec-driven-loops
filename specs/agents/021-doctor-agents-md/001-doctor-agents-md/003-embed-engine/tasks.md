---
title: "Tasks: embed engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md embed tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: embed engine

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

**Variables.** `E` is `.skilled/commands/doctor/scripts/agents-md-embed.cjs`. `T` is `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs`. `F` is `.skilled/commands/doctor/scripts/tests/fixtures/agents-md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'check-repo-rules' scratch/baseline.txt` prints at least `1`.
- [ ] T002 Confirm the update engine's classifier is exported and importable (`release-update.cjs`). Verify: `node -e "console.log(typeof require('./.skilled/commands/doctor/scripts/release-update.cjs').classifyFile)"` prints `function`.
- [ ] T003 Write the failing suite first, over temporary copies only (`T`). Verify: `node --test T` exits non-zero on `Cannot find module`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement the composer for the shipped sections plus the block (`E`). Verify: `node --test T` reports the composition case passing on the `foreign` fixture.
- [ ] T005 Implement the four carry groups, in order (`E`). Verify: `node --test T` reports the carry-order case passing.
- [ ] T006 Implement the preservation function as a pure export (`E`). Verify: `node --test T` reports the four invariant cases passing.
- [ ] T007 Implement `plan` with the diff, the ledger, the budget and the digest (`E`). Verify: `node E plan` on this repository prints `NOTHING TO DO` and exits 0.
- [ ] T008 Implement `apply --plan-digest`, with the recompose and the refusal (`E`). Verify: `node --test T` reports the digest-mismatch case exiting 2 with no write.
- [ ] T009 Implement backups and the ignored-directory fallback (`E`). Verify: `node --test T` reports the temp-directory fallback case passing.
- [ ] T010 Implement the post-write proof and the automatic restore (`E`). Verify: `node --test T` reports the planted-drop case ending `STATUS=FAIL` after a restore.
- [ ] T011 Implement `restore --run=<dir>` (`E`). Verify: `node --test T` reports byte equality after restore.
- [ ] T012 Add the allowlist check before every write (`E`). Verify: `node --test T` reports the allowlist case passing.
- [ ] T013 Add the `CLAUDE.md` and `.codex/AGENTS.md` paths, including `--keep-claude-md` (`E`). Verify: `node --test T` reports the `claude-only` case and its keep-flag case passing.
- [ ] T014 Add the router rows and the cursor mirror, reusing the existing generators (`E`). Verify: `node --test T` reports the rows case and the mirror-exists-when-block-non-empty case passing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Prove idempotence (`E`). Verify: a second `node E plan` on the applied copy prints `NOTHING TO DO`.
- [ ] T016 Prove the repo-rules rows are minimal (`E`). Verify: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs --root <tmp>` prints `RESULT: PASSED (11/11 checks)`.
- [ ] T017 Run the child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine --strict` prints `RESULT: PASSED`.
- [ ] T018 Confirm no tracked file was touched by the suite (`git status --porcelain`). Verify: the list names only the two files in `spec.md` section 3.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The measured plan runtime is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit.
- [ ] CHK-002 [P0] Child 002's engine exists and reports on this repository. Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0.
- [ ] CHK-003 [P1] The classifier is exported by the update engine. Verify: `node -e "console.log(typeof require('./.skilled/commands/doctor/scripts/release-update.cjs').classifyFile)"` prints `function`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The engine parses. Verify: `node --check .skilled/commands/doctor/scripts/agents-md-embed.cjs` exits 0.
- [ ] CHK-011 [P0] Every write passes the allowlist. Verify: the allowlist case passes and `rg -n 'ALLOWLIST' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints the check site.
- [ ] CHK-012 [P1] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing.
- [ ] CHK-013 [P1] The engine never stages or commits. Verify: `rg -n 'git add|git commit|git stash' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`.
- [ ] CHK-021 [P0] The suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` reports `fail 0`.
- [ ] CHK-022 [P1] The planted-drop case restores automatically. Verify: the case names the restore and the dropped lines.
- [ ] CHK-023 [P1] The suite uses temporary copies. Verify: `rg -c 'mkdtempSync' .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` prints at least `1`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing.
- [ ] CHK-031 [P0] No write outside the allowlist. Verify: the allowlist case passes with a refused path named.
- [ ] CHK-032 [P1] No consumer path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec and plan agree on the four parts of the invariant. Verify: `rg -c 'preservation' spec.md plan.md` reports a count in each.
- [ ] CHK-041 [P1] The allowlist in `spec.md` matches the one in code. Verify: the six paths appear in both.
- [ ] CHK-042 [P2] The plan runtime is recorded. Verify: `rg -n 'seconds' implementation-summary.md` prints the measured figure.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary copies live under the OS temp directory, created by `mkdtempSync`, and are removed. Verify: `git status --porcelain` lists no temporary path.
- [ ] CHK-051 [P1] No backup directory is created inside the repository during a test run. Verify: `ls .skilled/output 2>/dev/null` prints nothing new or fails.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
