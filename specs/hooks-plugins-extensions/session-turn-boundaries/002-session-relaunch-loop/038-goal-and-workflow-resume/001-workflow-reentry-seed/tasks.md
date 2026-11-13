---
title: "Tasks: Phase 1: workflow-reentry-seed"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "workflow reentry seed tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: workflow-reentry-seed

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

**Task variables**: `NUDGE` is `.skilled/hooks/session-relaunch/lib/nudge.cjs`. `CMD` is `.skilled/commands/speckit/handoff.md`. `TEST` is `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run the nudge suite before any edit and record the baseline (`TEST`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
- [ ] T002 Confirm the builders carry none of the new text (`NUDGE`). Verify: `rg -n 'Active command|Active goal|loop-lock\.cjs|goal\.md' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints no line and exits 1.
- [ ] T003 Record the pinned step-number assertions the new steps will renumber (`TEST`). Verify: `rg -n 'Number\.parseInt\(line, 10\)' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` prints 7 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the failing case for the active command line (`TEST`). Verify: `node --test --test-name-pattern 'active command line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 before the builder change.
- [ ] T005 Add the `Active command:` request to `handoffText` (`NUDGE`). Verify: `node --test --test-name-pattern 'active command line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
- [ ] T006 Add the failing case for the deep-loop lock release (`TEST`). Verify: `node --test --test-name-pattern 'deep-loop lock before prepare' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 before the builder change.
- [ ] T007 Add the release step before prepare (`NUDGE`). Verify: `node --test --test-name-pattern 'deep-loop lock before prepare' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
- [ ] T008 Add the failing case for the seed re-run step (`TEST`). Verify: `node --test --test-name-pattern 'runs the active command again' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 before the builder change.
- [ ] T009 Add the re-run step to `seedText` (`NUDGE`). Verify: `node --test --test-name-pattern 'runs the active command again' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
- [ ] T010 Add the failing case for the goal read step (`TEST`). Verify: `node --test --test-name-pattern 'reads the spec folder goal' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 before the builder change.
- [ ] T011 Add the goal read step to `seedText` (`NUDGE`). Verify: `node --test --test-name-pattern 'reads the spec folder goal' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
- [ ] T012 Add the failing case for the Codex active goal line and the bring-back step (`TEST`). Verify: `node --test --test-name-pattern 'active goal line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 1 before the builder change.
- [ ] T013 Add the Codex request to `handoffText` and the `create_goal` step to `seedText` (`NUDGE`). Verify: `node --test --test-name-pattern 'active goal line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
- [ ] T014 Update the pinned step numbers in the existing handoff and seed cases (`TEST`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [ ] T015 Mirror the note shape and the four steps in the manual command (`CMD`). Verify: `rg -n -e 'Active command' -e 'Active goal' -e 'goal\.md' -e 'release --owner-pid' .skilled/commands/speckit/handoff.md` prints at least one line for each term.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run the full nudge suite (`TEST`). Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [ ] T017 Run the claim guard and the record suite (`TEST` and `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [ ] T018 Run strict validation on the packet (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/001-workflow-reentry-seed --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row of `acceptance-criteria.md` is `Met`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/001-workflow-reentry-seed --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements are documented in `spec.md`. Verify: `rg -c '^\| REQ-' spec.md` prints 7.
- [ ] CHK-002 [P0] The technical approach is defined in `plan.md`. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' plan.md` prints one line.
- [ ] CHK-003 [P1] The release CLI exists and accepts the two values. Verify: `node --check .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The builder file parses. Verify: `node --check .skilled/hooks/session-relaunch/lib/nudge.cjs` exits 0.
- [ ] CHK-011 [P0] The builders carry no template token. Verify: `rg -n 'YOUR_VALUE_HERE' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints no line.
- [ ] CHK-012 [P1] The lock and command steps stay prose, not processes. Verify: `rg -n 'execSync|spawnSync|execFileSync' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints no line.
- [ ] CHK-013 [P1] The note keeps its four sections and flat frontmatter. Verify: `node --test --test-name-pattern 'all four sections and prepare command' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria are met. Verify: `rg -c '\| Met \|' acceptance-criteria.md` prints 7 at closure.
- [ ] CHK-021 [P0] The five must-fail cases pass. Verify: `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- [ ] CHK-022 [P1] The claim guard passes. Verify: `node --test --test-name-pattern 'claim exits zero and prints the claimed note body' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [ ] CHK-023 [P1] A missing command line and a missing `goal.md` leave the continue step intact. Verify: `node --test --test-name-pattern 'runs the active command again' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`, because two prose producers share one note shape. Verify: `rg -n 'Active command' spec.md plan.md` prints a line in each.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -n 'In-flight state|Remaining work' .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/commands/speckit/handoff.md` prints lines in both.
- [ ] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'handoffText|seedText' .skilled .opencode --glob '*.cjs' --glob '*.mjs' --glob '*.ts'` lists the adapters and the tests.
- [ ] CHK-FIX-004 [P0] No parser, path or redaction is added. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib/nudge.cjs | rg -n '^\+.*(parseHandoff|handoffPathWithinRepo|redact)'` prints no line.
- [ ] CHK-FIX-005 [P1] The matrix axes and covered rows are listed before completion. Verify: `rg -n 'Matrix axes' plan.md` prints one line.
- [ ] CHK-FIX-006 [P1] No new process-wide state is read. Verify: `git diff -U0 -- .skilled/hooks/session-relaunch/lib/nudge.cjs | rg -n '^\+.*process\.env'` prints no line.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit. Verify: `git rev-parse HEAD` prints the SHA named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added. Verify: `rg -n 'BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|api[_-]?key\s*=' .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/commands/speckit/handoff.md` prints no line.
- [ ] CHK-031 [P0] The new lines are string content and parse no input. Verify: `rg -n 'Active command|Active goal' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints only builder lines.
- [ ] CHK-032 [P1] N/A: the change adds no auth path and no new data store.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same change. Verify: `rg -l 'Active command' spec.md plan.md tasks.md` prints three paths.
- [ ] CHK-041 [P1] The new code comments carry no spec path or finding id. Verify: `rg -n 'specs/|finding|REQ-|F[0-9]' .skilled/hooks/session-relaunch/lib/nudge.cjs` prints no line.
- [ ] CHK-042 [P2] The README stays for phase 007. Verify: `git diff --name-only | rg -n 'session-relaunch/README\.md'` prints no line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only. Verify: `find . -maxdepth 1 -name '*.tmp'` prints no line.
- [ ] CHK-051 [P1] `scratch/` holds only the finding. Verify: `ls scratch` prints `finding.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
