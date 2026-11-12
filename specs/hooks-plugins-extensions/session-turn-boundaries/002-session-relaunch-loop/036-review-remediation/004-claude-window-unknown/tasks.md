---
title: "Tasks: Phase 4: claude-window-unknown"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "claude window unknown tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: claude-window-unknown

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

No shell variables are used. Every task names a repository-relative path in full.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the current resolver and record the fallback branch (`.skilled/hooks/session-relaunch/lib/context-usage.cjs`). Verify: `rg -n 'LARGE_WINDOW_MARKER|DEFAULT_WINDOW_TOKENS' .skilled/hooks/session-relaunch/lib/context-usage.cjs` prints the constant definitions at lines 24 and 26 and the fallback branch at lines 356 and 358.
- [x] T002 Read the only production caller (`.skilled/hooks/session-relaunch/claude/context-nudge.mjs`). Verify: `rg -n 'resolveWindow|fillRatio' .skilled/hooks/session-relaunch/claude/context-nudge.mjs` prints the import, the call at line 125 and the ratio at line 130.
- [x] T003 Read the current fallback cases (`.skilled/hooks/session-relaunch/tests/context-usage.test.cjs`). Verify: `rg -n 'one-million-token window|defaults to a 200000-token window' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` prints the two test names.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing-first case `resolveWindow returns null when no setting and no model marker supplies a window` (`.skilled/hooks/session-relaunch/tests/context-usage.test.cjs`). Verify: `node --test --test-name-pattern 'no setting and no model marker' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 1 with an assertion failure before the resolver changes.
- [x] T005 Replace the 200,000-token default case with `resolveWindow returns null instead of the 200000 default` (`.skilled/hooks/session-relaunch/tests/context-usage.test.cjs`). Verify: `rg -n 'returns null instead of the 200000 default' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` prints one line.
- [x] T006 Add the failing-first case `context-nudge skips and logs when the window is unknown` (`.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`). Verify: `node --test --test-name-pattern 'window is unknown' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 1 with an assertion failure before the nudge changes.
- [x] T007 Return `null` when no environment value, settings value or `[1m]` marker supplies a window (`.skilled/hooks/session-relaunch/lib/context-usage.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0 after T005.
- [x] T008 Update the `resolveWindow` return contract to `number or null` (`.skilled/hooks/session-relaunch/lib/context-usage.cjs`). Verify: `rg -n 'Configured window, or null when unknown' .skilled/hooks/session-relaunch/lib/context-usage.cjs` prints one line.
- [x] T009 Guard the nudge before `fillRatio`, emit nothing and log `context-nudge-skipped` with `reason=window-unknown` (`.skilled/hooks/session-relaunch/claude/context-nudge.mjs`). Verify: `node --test --test-name-pattern 'window is unknown' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] T010 Mark the `SESSION_RELAUNCH_WINDOW_TOKENS` row as environment-only and describe the unknown window (`.skilled/hooks/session-relaunch/README.md`). Verify: `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/README.md` prints one row containing `environment only` and `unknown window`.
- [x] T011 Add the `window` command with its failing-first case `window names the missing settings when no window is configured` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`). Verify: `node --test --test-name-pattern 'window names the missing settings' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [x] T018 Add the informational window step after the last-session-hop step (`.skilled/commands/doctor/assets/doctor-setup.yaml`). Verify: `rg -c 'session-relaunch.cjs window' .skilled/commands/doctor/assets/doctor-setup.yaml` prints 1.
- [x] T019 Add the window line to the presentation and the command document (`.skilled/commands/doctor/assets/doctor-setup-presentation.txt`). Verify: `rg -c 'Claude context window' .skilled/commands/doctor/assets/doctor-setup-presentation.txt .skilled/commands/doctor/setup.md` prints a count for both files.
- [x] T020 Log the unknown-window skip once per session through a mark in the nudge state file (`.skilled/hooks/session-relaunch/lib/nudge.cjs`). Verify: `node --test --test-name-pattern 'once per session|marks a session once' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0.
- [x] T021 Reject arguments to the `window` command (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`). Verify: `node --test --test-name-pattern 'window rejects an argument' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [x] T022 Print `none configured` when no window is set (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`). Verify: `rg -c 'Claude context window: none configured' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the two named suites together (`.skilled/hooks/session-relaunch/tests/context-usage.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with no failing case.
- [x] T013 Run the full session-relaunch suite (`.skilled/hooks/session-relaunch/tests/context-usage.test.cjs`). Verify: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0.
- [x] T014 Run strict validation on the packet (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/acceptance-criteria.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown --strict --quiet` prints `RESULT: PASSED`.
- [x] T015 Confirm the corrected README row (`.skilled/hooks/session-relaunch/README.md`). Verify: `rg -n 'environment only' .skilled/hooks/session-relaunch/README.md` prints one line.
- [x] T016 Confirm the Pi and OpenCode window readers are unchanged (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts`). Verify: `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/pi/session-relaunch.ts .opencode/plugins/session-relaunch.js` prints one line in each file.
- [x] T017 Confirm no ephemeral identifiers entered the production files (`.skilled/hooks/session-relaunch/lib/context-usage.cjs`). Verify: `rg -n 'ADR-|REQ-|CHK-|T[0-9]{3}' .skilled/hooks/session-relaunch/lib/context-usage.cjs .skilled/hooks/session-relaunch/claude/context-nudge.mjs` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both named suites exit 0 with a case where no setting and no marker yields no window and no nudge
- [x] The strict validator prints `RESULT: PASSED`
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

A blocked task stays `[B]` and blocks close. It is unblocked only when the open question in `goal.md` section 4 names the `/doctor:setup` check file.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Verify: `rg -c 'REQ-00[1-7]' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/spec.md` prints 7.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Verify: `rg -n '^## 4. IMPLEMENTATION PHASES' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/plan.md` prints one line.
- [x] CHK-003 [P1] Dependencies identified and available. Verify: `rg -n 'Dependency \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/spec.md` prints one row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The resolver parses. Verify: `node --check .skilled/hooks/session-relaunch/lib/context-usage.cjs` exits 0.
- [x] CHK-011 [P0] The nudge parses. Verify: `node --check .skilled/hooks/session-relaunch/claude/context-nudge.mjs` exits 0.
- [x] CHK-012 [P1] No console output entered the hook path. Verify: `rg -n 'console\.(log|warn|error)' .skilled/hooks/session-relaunch/lib/context-usage.cjs .skilled/hooks/session-relaunch/claude/context-nudge.mjs` prints nothing.
- [x] CHK-013 [P1] The skip event is used in both the caller and its test. Verify: `rg -n 'context-nudge-skipped' .skilled/hooks/session-relaunch/claude/context-nudge.mjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` prints the caller line and three test lines.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are settled. Verify: `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/acceptance-criteria.md` prints no line.
- [x] CHK-021 [P0] The handoff command passes. Verify: `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0.
- [x] CHK-022 [P1] The unknown-window edge case passes. Verify: `node --test --test-name-pattern 'no setting and no model marker' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0.
- [x] CHK-023 [P1] The unreadable-settings path still passes. Verify: `node --test --test-name-pattern 'settings read errors as absent' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding 4 is recorded with its class. Verify: `rg -n 'instance-only' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/plan.md` prints one line.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `rg -n 'DEFAULT_WINDOW_TOKENS|LARGE_WINDOW_MARKER' .skilled/hooks/session-relaunch/lib/context-usage.cjs` prints the marker line and no `DEFAULT_WINDOW_TOKENS` line after the fix.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete. Verify: `rg -n 'resolveWindow\(' .skilled/hooks/session-relaunch` prints the definition, the Claude caller, the `window` command caller and the test callers, with no Pi or OpenCode line.
- [x] CHK-FIX-004 [P0] N/A: The change handles no delimiter, joined input, outside-root path or redaction case, because it adds no parser or path input.
- [x] CHK-FIX-005 [P1] The matrix axes and row count are listed. Verify: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/plan.md` prints one line.
- [x] CHK-FIX-006 [P1] The hostile environment variant passes. Verify: `node --test --test-name-pattern 'SESSION_RELAUNCH_WINDOW_TOKENS precedence' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0.
- [x] CHK-FIX-007 [P1] Evidence is pinned to an explicit diff. Verify: `git diff --stat` prints the changed production, docs and test files.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret entered the change. Verify: `rg -n '(api[_-]?key|password|secret)[[:space:]]*=' .skilled/hooks/session-relaunch/lib/context-usage.cjs .skilled/hooks/session-relaunch/claude/context-nudge.mjs` prints nothing.
- [x] CHK-031 [P0] N/A: The change adds no input surface and reads the existing environment and settings values through `positiveNumber`.
- [x] CHK-032 [P1] N/A: The change touches no auth or authorization path.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks are synchronized. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown --strict --quiet` prints `RESULT: PASSED`.
- [x] CHK-041 [P1] The durable comments explain the unknown case. Verify: `rg -n 'unknown window|window is unknown' .skilled/hooks/session-relaunch/lib/context-usage.cjs .skilled/hooks/session-relaunch/claude/context-nudge.mjs` prints the comment lines in both files.
- [x] CHK-042 [P2] The README row is corrected. Verify: `rg -n 'environment only' .skilled/hooks/session-relaunch/README.md` prints one line.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scratch holds evidence only. Verify: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/scratch` prints the red and green run files and the review diff.
- [x] CHK-051 [P1] Scratch sits inside the untracked packet. Verify: `git status --porcelain -- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown/scratch` prints the folder as untracked and nothing else.
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
