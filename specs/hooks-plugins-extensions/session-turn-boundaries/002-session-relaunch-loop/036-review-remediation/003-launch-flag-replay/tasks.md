---
title: "Tasks: Phase 3: launch-flag-replay"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "launch flag replay tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: launch-flag-replay

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

- [x] T001 Confirm the builder definition and every reference in `.skilled/bin/skilled-loop`. Verify: `rg -n 'build_relaunch_arguments|original_arguments' .skilled/bin/skilled-loop` prints the definition, the two manual-template calls, the first-launch store and the hop call.
- [x] T002 Confirm the carried-arguments paragraph in `.skilled/hooks/session-relaunch/README.md`. Verify: `rg -n 'A hop replays the first launch' .skilled/hooks/session-relaunch/README.md` prints one line at line 83, the rewritten paragraph.
- [x] T003 Count the existing cases in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`. Verify: `rg -c '^test\(' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` printed 103 before the phase and prints 118 after it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the Claude replay case in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, named `Claude first launch arguments are replayed with --permission-mode and --add-dir`, asserting that the second launch holds both flags and the seed replaces the prompt. Verify: `node --test --test-name-pattern 'replayed with --permission-mode' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# fail 1` before the fix.
- [x] T005 Write the five remaining arm replay cases in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, named `Pi first launch arguments are replayed`, `OpenCode first launch arguments are replayed`, `Codex first launch arguments are replayed`, `Cursor first launch arguments are replayed` and `Devin first launch arguments are replayed`. Verify: `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# fail 6` before the fix, counting the Claude case from T004.
- [x] T006 Write the case named `deny list flags are absent from a hop` in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, one entry that takes a value and one that does not. Verify: `node --test --test-name-pattern 'deny list' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# fail 1` before the fix.
- [x] T007 Make the option scan in `.skilled/bin/skilled-loop` collect the replayed extras from `original_arguments` with the two per-runtime option tables, and make `build_relaunch_arguments` append them after the seed, or before the `--` separator on Devin, leaving the record-backed settings and the seed where they are today. Verify: `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 6` and `# fail 0`.
- [x] T008 Add the one deny list and its filter in `.skilled/bin/skilled-loop`, with one entry shape that states whether the flag takes a value. Verify: `node --test --test-name-pattern 'deny list' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] T009 Keep the manual claim command on its carried set through an explicit mode in `.skilled/bin/skilled-loop`, so `build_manual_command_template` and `find_manual_template_conflict` build as they do today. Verify: `node --test --test-name-pattern 'manual command' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# fail 0`.
- [x] T010 Update the exact second-hop assertion in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` to the replayed list. Verify: `node --test --test-name-pattern 'second invocation uses only the seed and name' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] T015 Write the case named `an unknown option before a bare word declines the hop` in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`. Verify: `node --test --test-name-pattern 'unknown option before a bare word' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# fail 1` before the fix.
- [x] T016 Make the wrapper in `.skilled/bin/skilled-loop` warn at launch and decline the hop with the manual claim command when an option in neither table is followed by a bare word. Verify: `node --test --test-name-pattern 'unknown option before a bare word' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] T017 Write the case named `a hop replaces the start prompt and the record settings` in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`. Verify: `node --test --test-name-pattern 'replaces the start prompt and the record settings' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0` after the fix.
- [x] T018 Write the four review cases and widen the deny-list case to all six arms (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` reports the four cases `a hop keeps a dash-leading value and stops at the separator`, `an unknown option that carries its value is not ambiguous`, `a joined short resume option is not replayed` and `Codex takes its model from a config setting when no model flag is given` as failing before the fix.
- [x] T019 Class joined short options, skip the ambiguity check for `=` forms, carry a Codex `-c model=` and extend the deny list in `.skilled/bin/skilled-loop`. Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and lists the four cases `a hop keeps a dash-leading value and stops at the separator`, `an unknown option that carries its value is not ambiguous`, `a joined short resume option is not replayed` and `Codex takes its model from a config setting when no model flag is given` as passing.
- [x] T011 Replace the carried-arguments paragraph in `.skilled/hooks/session-relaunch/README.md` with the replay rule and the deny list. Verify: `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run every wrapper case in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`. Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and prints `# fail 0`.
- [x] T013 Run the strict validator for the packet at `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay/spec.md`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay --strict --quiet` prints `RESULT: PASSED`.
- [x] T014 Check comment hygiene in `.skilled/bin/skilled-loop`. Verify: `rg -n 'specs/|REQ-0|036-review' .skilled/bin/skilled-loop` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0
- [x] The strict validator prints `RESULT: PASSED` for `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay/spec.md`
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

- [x] CHK-001 [P0] Seven requirements are documented: `rg -c '^\| REQ-' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay/spec.md` prints 7.
- [x] CHK-002 [P0] The technical approach names the changed function: `rg -n 'build_relaunch_arguments' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay/plan.md` prints at least one line.
- [x] CHK-003 [P1] The one dependency is recorded: `rg -c '^\| Dependency' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay/spec.md` prints 1.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The wrapper parses: `bash -n .skilled/bin/skilled-loop` exits 0.
- [x] CHK-011 [P0] No shell trace is left on: `rg -n 'set -x' .skilled/bin/skilled-loop` prints nothing.
- [x] CHK-012 [P1] The deny list is present and read: `rg -n 'skilled_loop_replay_denied' .skilled/bin/skilled-loop` prints the list and its use in the scan.
- [x] CHK-013 [P1] The change stays inside the one builder: `rg -c '^build_relaunch_arguments\(\)' .skilled/bin/skilled-loop` prints 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every wrapper case passes: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0.
- [x] CHK-021 [P0] The permission-mode case passes: `node --test --test-name-pattern 'replayed with --permission-mode' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing test.
- [x] CHK-022 [P1] All six arms are covered: `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports six passing tests.
- [x] CHK-023 [P1] The deny list is covered: `node --test --test-name-pattern 'deny list' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and reports one passing test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is recorded: `rg -n 'Finding class' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay/plan.md` prints one line naming `class-of-bug`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete: `rg -n 'build_relaunch_arguments|original_arguments' .skilled/bin/skilled-loop` prints the definition, the first-launch store and every call.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete: `rg -n 'build_relaunch_arguments|SKILLED_LOOP_MANUAL_TEMPLATE' .skilled --glob '*.cjs' --glob '*.md'` prints the manual-template callers and the README paragraph.
- [x] CHK-FIX-004 [P0] The adversarial cases run: `node --test --test-name-pattern 'first launch arguments are replayed' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0, and `a hop keeps a dash-leading value and stops at the separator` covers a value that starts with `-`, a flag with no value and the `--` separator. A value equal to `--` ends the scan like the separator.
- [x] CHK-FIX-005 [P1] The matrix axes and row count are listed: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay/plan.md` prints one line with the six arms and the row count.
- [x] CHK-FIX-006 [P1] N/A: the replay reads the wrapper's own exported settings, which the suite clears at test file line 19, and it adds no other process-wide state.
- [x] CHK-FIX-007 [P1] The evidence is pinned to a diff range, because nothing is committed without the operator: `git rev-parse --short HEAD` prints `5dafa313e8`, the base of the range `5dafa313e8..working tree`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A: the change adds no credential, endpoint or secret, and the wrapper reads none.
- [x] CHK-031 [P0] N/A: the change replays argv the wrapper already received and parses no new input shape.
- [x] CHK-032 [P1] N/A: the wrapper runs no server and enforces no identity.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The packet validates: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay --strict --quiet` prints `RESULT: PASSED`.
- [x] CHK-041 [P1] No ephemeral label sits in a code comment: `rg -n 'specs/|REQ-0|036-review' .skilled/bin/skilled-loop` prints nothing.
- [x] CHK-042 [P2] The README names the deny list: `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` prints 1.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch holds evidence only: the red and green run files, the saved help texts and the review diff.
- [x] CHK-051 [P1] N/A: the scratch files are evidence and stay with the packet.
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
