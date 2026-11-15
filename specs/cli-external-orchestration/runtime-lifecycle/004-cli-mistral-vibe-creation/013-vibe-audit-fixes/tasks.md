---
title: "Tasks: Phase 13: vibe-audit-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe audit fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: vibe-audit-fixes

<!-- SPECKIT_LEVEL: 1 -->

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

`G` is `.vibe/plugins/repo-guards`. `D` is `.skilled/hooks/dispatch/lib`. `F` is `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. `U` is `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`. `S` is `.skilled/skills/system-spec-kit/runtime/cli/vibe`. `T` is `.skilled/skills/system-spec-kit/runtime/cli/tests`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline counts of the hook and dispatch suites (`scratch/baseline.txt`). Verify: `node --test D/*.test.mjs G/tests/*.test.mjs` prints `fail 0`, and its `pass` count is in `scratch/baseline.txt`.
- [x] T002 Record the baseline fan-out unit count (`scratch/baseline.txt`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, prints no failed test, and the count is in `scratch/baseline.txt`.
- [x] T003 [P] Reproduce the dotfile drift with a `.DS_Store` in a temporary `VIBE_SKILLS_OUTPUT_DIR` copy (`scratch/dotfile-repro.txt`). Verify: `node S/sync-skills-vibe.cjs --check` exits 1 and prints an `EXTRA` line naming `.DS_Store`; any other result is logged in `goal.md` as a drop with the output.
- [x] T004 [P] Record the git-message-gate hook's output on its two fixture payloads, before any `hook-io.mjs` change (`scratch/git-gate-before.txt`). Verify: `node G/git-message-gate.mjs < G/fixtures/git-message-gate/violating-payload.json` prints a `"decision":"deny"` line, and the clean payload prints nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the relative-symlink env-guard test (`G/tests/env-secret-guard.test.mjs`). Verify: before T013, `node --test G/tests/env-secret-guard.test.mjs` prints `fail 1`.
- [x] T006 Add a `.DS_Store` case to a new Vibe skills-mirror test that phase 020 extends (`T/sync-skills-vibe.test.mjs`). Verify: before T007, `node --test T/sync-skills-vibe.test.mjs` prints `fail 1`.
- [x] T007 Skip dotfiles in `listOutputEntries` (`S/sync-skills-vibe.cjs`). Verify: `node --test T/sync-skills-vibe.test.mjs` prints `fail 0`, and the T003 reproduction now exits 0.
- [x] T008 Open the ancestor-symlink finding and fix it if it holds (`S/sync-skills-vibe.cjs`). Verify: the `goal.md` log row quotes `assertOutputDirectorySafe` (line 281 before any edit) and states fixed or dropped.
- [x] T009 Open the same ancestor-symlink check and fix it if it holds (`S/sync-agents-vibe.cjs`). Verify: the `goal.md` log row quotes `assertOutputDirectorySafe` (line 122 before any edit) and states fixed or dropped.
- [x] T010 Open the same ancestor-symlink check and fix it if it holds (`S/sync-prompts-vibe.cjs`). Verify: the `goal.md` log row quotes `assertOutputDirectorySafe` (line 142 before any edit) and states fixed or dropped.
- [x] T011 Open the `ERROR_POLICY` finding, then either assert it in the test or drop the export (`.skilled/hooks/goal/vibe/goal-inject.mjs`). Verify: `rg -rn ERROR_POLICY .skilled/hooks/goal/vibe` prints either a test assertion line or nothing.
- [x] T012 Export the one shared `sessionDirFor`, leaving `toCoreCall` unchanged (`G/lib/hook-io.mjs`). Verify: `rg -c "export function sessionDirFor" G/lib/hook-io.mjs` prints 1, and `rg -c "cwd: REPO_ROOT" G/lib/hook-io.mjs` still prints 3.
- [x] T013 Pass the session folder at the env-guard call site, `{ ...toCoreCall(payload), cwd: sessionDirFor(payload.cwd) }` (`G/env-secret-guard.mjs`). Verify: `node --test G/tests/env-secret-guard.test.mjs` prints `fail 0`.
- [x] T014 Replace the local `sessionDirFor` copy with the shared import (`G/overlay-guard.mjs`). Verify: `rg -c "^function sessionDirFor" G/overlay-guard.mjs` prints 0, and `node --check G/overlay-guard.mjs` exits 0.
- [x] T015 Replace the local `sessionDirFor` copy with the shared import (`G/spec-gate.mjs`). Verify: `rg -c "^function sessionDirFor" G/spec-gate.mjs` prints 0, and `node --test G/tests/spec-gate.test.mjs` prints `fail 0`.
- [x] T016 Replace the local `sessionDirFor` copy with the shared import (`G/spec-gate-classify.mjs`). Verify: `rg -c "^function sessionDirFor" G/spec-gate-classify.mjs` prints 0, and `node --check G/spec-gate-classify.mjs` exits 0.
- [x] T017 Replace the local `sessionDirFor` copy with the shared import (`G/post-edit-quality.mjs`). Verify: `rg -c "^function sessionDirFor" G/post-edit-quality.mjs` prints 0, and `node --check G/post-edit-quality.mjs` exits 0.
- [x] T018 Build a temporary `goal.md` fixture packet and point `VIBE_SPEC_FOLDER` at it instead of the live 011 packet, as `goal-cursor.test.mjs:229-233` does (`.skilled/hooks/goal/vibe/goal-vibe.test.mjs`). Verify: `rg -c "011-vibe-context" .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints 0, and `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`.
- [x] T019 Add the two relative-home cases (`D/dispatch-rule-checks.test.mjs`). Verify: before T020, `node --test D/dispatch-rule-checks.test.mjs` prints at least one failure from those cases.
- [x] T020 Resolve a relative `VIBE_HOME` with `vibeWorkingDirectory()` (`D/dispatch-rule-checks.mjs`). Verify: `node --test D/dispatch-rule-checks.test.mjs` prints `fail 0`.
- [x] T021 Export the two session-free sets (`D/dispatch-audit.mjs`). Verify: `rg -c "^export const VIBE_SESSION_FREE_" D/dispatch-audit.mjs` prints 2.
- [x] T022 Import the two session-free sets instead of redefining them (`D/dispatch-rule-checks.mjs`). Verify: `rg -l "VIBE_SESSION_FREE_FLAGS = new Set" D/` prints only `D/dispatch-audit.mjs`, and `node --test D/dispatch-rule-checks.test.mjs` prints `fail 0`.
- [x] T023 Add the null-exit, stopped-outcome and roster-equality cases (`U`). Verify: before T024, `npx vitest run tests/unit/fanout-run.vitest.ts` prints at least one failure from those cases.
- [x] T024 Require an integer exit code of 0, and name the outcome in the failure message (`F`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts` prints no failed test.
- [x] T025 [P] Add the mirror comment on `VIBE_ALLOWED_MODELS` (`F`). Verify: `rg -n "Mirrors VIBE_SUPPORTED_MODELS" F` prints one line.
- [x] T026 [P] Add JSDoc to `isVibeBinaryAvailable`, `validateVibeCompletion` and `buildVibeLineageCommand` (`F`). Verify: `rg -B1 -n "^function (isVibeBinaryAvailable|validateVibeCompletion|buildVibeLineageCommand)" F` shows a `*/` line before each of the three.
- [x] T027 [P] Split the 129-character `require` line (`F`). Verify: `awk 'length > 120 && /vibe/i' F` prints nothing.
- [x] T028 [P] Replace the ignored `pre_tool` `additional_context` write with a `system_message` UI note, which Vibe's `pre_tool` runner still shows (`_foreign_hooks.py:378-379`) (`G/spec-gate.mjs`). Verify: `rg -c additional_context G/spec-gate.mjs` prints 0, `rg -c system_message G/spec-gate.mjs` prints at least 1, and `node --test G/tests/spec-gate.test.mjs` prints `fail 0`.
- [x] T029 Refuse every leftover substitution form, and newline and carriage return in the root (`G/render-home-hooks.cjs`). Verify: `node --test G/tests/render-home-hooks.test.mjs` prints `fail 0` with the new `$VAR`, `${VAR}` and backtick cases.
- [x] T030 [P] Compare the rendered commands against the real repo path (`G/tests/render-home-hooks.test.mjs`). Verify: `rg -n realpathSync G/tests/render-home-hooks.test.mjs` prints a line.
- [x] T031 [P] Wrap the 124-character line 42 (`G/tests/render-home-hooks.test.mjs`). Verify: `awk 'length > 120' G/tests/render-home-hooks.test.mjs` prints nothing.
- [x] T032 [P] Wrap the note write in try/catch (`G/overlay-guard.mjs`). Verify: `node --check G/overlay-guard.mjs` exits 0, and `rg -n -B1 "process.stderr.write" G/overlay-guard.mjs` shows a `try` line.
- [x] T033 [P] Add the MODULE box header (`G/fixtures/spec-gate/seed-state.mjs`). Verify: `sed -n 2,4p G/fixtures/spec-gate/seed-state.mjs` prints the divider, a `MODULE:` line and the divider.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T034 Rerun the hook and dispatch suites (`D/`, `G/tests/`). Verify: `node --test D/*.test.mjs G/tests/*.test.mjs` prints `fail 0`, with a `pass` count above the T001 baseline.
- [x] T035 Rerun the fan-out unit suite (`U`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts` prints no failed test, with a count above the T002 baseline.
- [x] T036 Rerun the git-message-gate payloads after the `hook-io.mjs` change (`scratch/git-gate-after.txt`). Verify: `diff scratch/git-gate-before.txt scratch/git-gate-after.txt` prints nothing.
- [x] T037 Syntax-check every touched file (`scratch/node-check.txt`). Verify: `node --check` exits 0 on each touched `.mjs` and `.cjs` file, and the list is in `scratch/node-check.txt`.
- [x] T038 Log each finding's verdict as a row of the `| Item | State | Evidence |` table, the Item cell starting `P1 `, `P2 ` or `Verify-first ` (`goal.md`). Verify: `rg -c "^\| (P1|P2|Verify-first) " goal.md` prints at least 18.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both P1 regression tests failed before their fix and pass after it, recorded in `goal.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
