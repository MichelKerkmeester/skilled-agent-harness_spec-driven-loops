---
title: "Tasks: Phase 2: state-dir-read-check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "state dir read check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: state-dir-read-check

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

**Paths.** File paths are written in full. No short path names are defined. Commands run from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the directory guard and the record read in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`. Verify: `rg -n 'function ensureStateDir|function readRelaunchFile' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints both definitions.
- [x] T002 Read the containment helper and `consume` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`. Verify: `rg -n 'function handoffPathWithinRepo|function consume' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints both definitions.
- [x] T003 Confirm the read suite passes before any change (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [x] T004 Confirm the CLI suite passes before any change (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add a case named `readRelaunchFile reads no record from a symlinked state directory` and a foreign-owner case to `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`. Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits non-zero and names the symlinked-state-directory case as failing.
- [x] T006 Apply the `ensureStateDir` real-directory and owner check inside `readRelaunchFile` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, create no directory, and return null plus a log entry when the check fails. Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with the symlinked-state-directory case passing.
- [x] T007 Add a case named `consume refuses a handoff outside the handoffs directory` to `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`. Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits non-zero and names the outside-handoff case as failing.
- [x] T008 Pass `record.handoff` through `handoffPathWithinRepo` in `consume` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` and refuse a rejected path. Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with the outside-handoff case passing.
- [x] T012 Add the failing case `a nudge state file behind a symlinked state directory reads as empty` (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Verify: `node --test --test-name-pattern 'nudge state file behind a symlinked state directory' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits non-zero before the fix.
- [x] T013 Check the state directory in `readStateFile` before the read (`.skilled/hooks/session-relaunch/lib/nudge.cjs`). Verify: `node --test --test-name-pattern 'nudge state file behind a symlinked state directory' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the read suite after both fixes (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [x] T010 Run the CLI suite after both fixes (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [x] T011 Validate the packet (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The handoff command `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with both adversarial cases recorded in `implementation-summary.md`
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

Commands below run from the repository root, as the task notation states.

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

- [x] CHK-001 [P0] The finding is recorded in `spec.md`. Verify: `rg -n 'ensureStateDir' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/spec.md` prints at least one line.
- [x] CHK-002 [P0] The affected surfaces are recorded in `plan.md`. Verify: `rg -c 'readRelaunchFile' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/plan.md` prints at least `1`.
- [x] CHK-003 [P1] The test runner answers. Verify: `node --version` prints a version.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The library parses. Verify: `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0.
- [x] CHK-011 [P0] The CLI parses. Verify: `node --check .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` exits 0.
- [x] CHK-012 [P0] The read check creates no directory. Verify: `rg -n 'mkdirSync' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the directory creation in `ensureStateDir` with its comment and the lock creation in `withAppendLock`, all outside `readRelaunchFile`.
- [x] CHK-013 [P1] The read path reports a refused directory on stderr through `process.stderr.write` and uses no console call. Verify: `rg -n 'console\.' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The read suite passes. Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0.
- [x] CHK-021 [P0] The CLI suite passes. Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [x] CHK-022 [P1] The symlinked-directory case is present. Verify: `rg -n 'readRelaunchFile reads no record from a symlinked state directory' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` prints one line.
- [x] CHK-023 [P1] The outside-handoff case is present. Verify: `rg -n 'consume refuses a handoff outside the handoffs directory' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` prints one line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding is classed `cross-consumer` in `spec.md`. Verify: `rg -c 'cross-consumer' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/spec.md` prints `1`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -n 'ensureStateDir\(' .skilled/hooks/session-relaunch --glob '!**/tests/**' --glob '!**/*.test.*'` prints the definition and the write-path callers in `relaunch-core.cjs`, `nudge.cjs` and `killer.cjs`.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'readRelaunchFile' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the definition and its internal callers.
- [x] CHK-FIX-004 [P0] The adversarial cases are present. Verify: `rg -n 'readRelaunchFile reads no record from a symlinked state directory|consume refuses a handoff outside the handoffs directory' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` prints both case names.
- [x] CHK-FIX-005 [P1] The matrix axes and row count are listed. Verify: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/plan.md` prints the line naming 4 directory states and 3 handoff locations.
- [x] CHK-FIX-006 [P1] N/A: the check reads only the directory named by the passed environment and no process-wide global beyond `process.getuid`.
- [x] CHK-FIX-007 [P1] The evidence is pinned to a fix SHA or diff range. Verify: `rg -n 'fix SHA|diff range' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/implementation-summary.md` prints the pin.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret is added. Verify: `rg -ni 'api[_-]?key|password|secret' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing.
- [x] CHK-031 [P0] A symlinked or foreign-owned state directory yields no record. Verify: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with both cases passing.
- [x] CHK-032 [P1] An outside handoff is refused before the note is read. Verify: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with the outside-handoff case passing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the read check. Verify: `rg -l 'readRelaunchFile' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/spec.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/plan.md specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/tasks.md` prints three paths.
- [x] CHK-041 [P1] A comment beside the read check names the real-directory and owner rule. Verify: `rg -n 'symlink|owner' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints at least one comment or message line about the rule.
- [x] CHK-042 [P2] N/A: no README documents this internal read guard and the finding names no docs file.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch holds evidence only. Verify: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/scratch` prints the red and green run files and the review diff.
- [x] CHK-051 [P1] Scratch sits inside the untracked packet. Verify: `git status --porcelain -- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check/scratch` prints the folder as untracked and nothing else.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
