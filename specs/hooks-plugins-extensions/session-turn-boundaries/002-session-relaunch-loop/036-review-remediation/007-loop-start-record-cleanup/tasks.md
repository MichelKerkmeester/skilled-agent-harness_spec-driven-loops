---
title: "Tasks: Phase 7: loop-start-record-cleanup"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "loop start record cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: loop-start-record-cleanup

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

Every task names its file in full. The list defines no path variables.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the loop id export in `.skilled/bin/skilled-loop`. Verify: `rg -n 'SKILLED_LOOP_ID="\$\$"' .skilled/bin/skilled-loop` prints one line.
- [x] T002 Confirm the record path builder in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`. Verify: `rg -n '^function relaunchFilePath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line.
- [x] T003 Confirm the sandbox state directory used by the wrapper suite in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`. Verify: `rg -n 'skilled-relaunch' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints the sandbox state-directory line and the record path lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the failing case named `wrapper removes its own leftover relaunch record before the first launch` in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, with a launcher that writes `relaunch-$$.json` and then `exec`s the wrapper so the planted id is the wrapper's own. Verify: `node --test --test-name-pattern 'own leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# fail 1` before the fix.
- [x] T005 Write the guard case named `a leftover relaunch record for another loop is kept` in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, planting `relaunch-999999.json` beside the own record. Verify: `node --test --test-name-pattern 'record for another loop is kept' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] T006 Add the startup cleanup in `.skilled/bin/skilled-loop` after the `SKILLED_LOOP_ID` export and before the launch loop, building the path through `relaunchFilePath` and removing it with `rm -f --`. Verify: `node --test --test-name-pattern 'own leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Write the adversarial case named `an own leftover record that is a symlink is removed and its target is kept` in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`. Verify: `node --test --test-name-pattern 'record that is a symlink' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0.
- [x] T007 Run every wrapper case in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`. Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and prints `# fail 0`.
- [x] T008 Check comment hygiene in `.skilled/bin/skilled-loop`. Verify: `rg -n 'specs/|REQ-0|036-review' .skilled/bin/skilled-loop` prints nothing.
- [x] T009 Run the strict validator for the packet at `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/spec.md`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0
- [x] `rg -n 'SKILLED_LOOP_ID="\$\$"|relaunch-' .skilled/bin/skilled-loop` prints the export and the cleanup's path lookup
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Three requirements are documented: `rg -c '^\| REQ-' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/spec.md` prints 3.
- [x] CHK-002 [P0] The technical approach names the changed startup statement: `rg -n 'SKILLED_LOOP_ID' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/plan.md` prints at least one line.
- [x] CHK-003 [P1] The two dependencies are recorded: `rg -c '^\| Dependency' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/spec.md` prints 2.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The wrapper parses: `bash -n .skilled/bin/skilled-loop` exits 0.
- [x] CHK-011 [P0] No shell trace is left on: `rg -n 'set -x' .skilled/bin/skilled-loop` prints nothing.
- [x] CHK-012 [P1] The cleanup runs before the launch loop: `rg -n 'SKILLED_LOOP_ID="\$\$"|while true' .skilled/bin/skilled-loop` prints the export before the launch loop.
- [x] CHK-013 [P1] The cleanup builds the path through the core: `rg -n 'relaunchFilePath' .skilled/bin/skilled-loop` prints one line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every wrapper case passes: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0.
- [x] CHK-021 [P0] The own-record case passes: `node --test --test-name-pattern 'own leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0.
- [x] CHK-022 [P1] The other-record guard passes: `node --test --test-name-pattern 'record for another loop is kept' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0.
- [x] CHK-023 [P1] N/A: the pre-fix failure is recorded in T004's Verify output, so no separate command answers it after the fix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is recorded: `rg -n 'Finding class' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/plan.md` prints one line naming `instance-only`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete: `rg -n 'SKILLED_LOOP_ID="\$\$"' .skilled/bin/skilled-loop` prints one line.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete: `rg -n 'relaunchFilePath|SKILLED_LOOP_ID' .skilled/hooks/session-relaunch .skilled/bin/skilled-loop --glob '*.cjs' --glob '*.md'` prints the path builder, the wrapper export and every CLI read.
- [x] CHK-FIX-004 [P0] The adversarial cases run: `node --test --test-name-pattern 'leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with three cases: an own record, another loop's record and an own record that is a symlink. Every other wrapper case starts with no record.
- [x] CHK-FIX-005 [P1] The matrix axes and row count are listed: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/plan.md` prints one line with the two axes and the row count.
- [x] CHK-FIX-006 [P1] N/A: the cleanup reads only the wrapper's own process id and the state-directory environment, and the suite pins `XDG_RUNTIME_DIR` in its sandbox.
- [x] CHK-FIX-007 [P1] The evidence is pinned to an explicit diff: `git diff --stat -- .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints the two changed files, against base `5dafa313e8`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A: the change adds no credential, endpoint or secret.
- [x] CHK-031 [P0] N/A: the loop id is the wrapper's own numeric process id and no new input is parsed.
- [x] CHK-032 [P1] N/A: the wrapper runs no server and enforces no identity.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The packet validates: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup --strict --quiet` prints `RESULT: PASSED`.
- [x] CHK-041 [P1] No ephemeral label sits in a code comment: `rg -n 'specs/|REQ-0|036-review' .skilled/bin/skilled-loop` prints nothing.
- [x] CHK-042 [P2] N/A: the README sentence that names the loop id export stays true and the record lifetime is not documented there.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch holds evidence only: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/scratch` prints the red and green run files and the review diff.
- [x] CHK-051 [P1] Scratch sits inside the untracked packet: `git status --porcelain -- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup/scratch` prints the folder as untracked and nothing else.
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
