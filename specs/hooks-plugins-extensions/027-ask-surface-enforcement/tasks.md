---
title: "Tasks: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ask surface enforcement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`G` is `.skilled/hooks/ask-surface-guard/`. `S` is `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the registry baseline (`hook-registry.json`). Verify: `S --check` exits 0 and `rg -c '"event":' hook-registry.json` prints 105. Evidence: 105 `"event":` keys before the change; `--check` failed only after the registry edit, then passed.
- [x] T002 Record the AGENTS.md baseline (`AGENTS.md`). Verify: `agents-md-check.cjs` A6 prints `16376 of 16384 bytes to the last anchor`, and `agents-md-manifest.cjs --check` already prints its stale derived-key failure. Evidence: A6 printed `16376 of 16384 bytes`; the manifest check already failed on a stale derived key.
- [x] T003 Create the concern folder with `lib/`, `claude/`, `codex/`, `devin/`, `dsh/`, `pi/` and `fixtures/` (`G`). Verify: `ls G` lists the seven folders. Evidence: `lib/`, `claude/`, `codex/`, `devin/`, `dsh/`, `pi/`, `fixtures/` exist.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Amend §4 and §5: the §5 tool is the required surface, the tool table is corrected (OpenCode `question`, Pi `ask_user_question` or `question`, Devin and DSH `ask_user_question`, Cursor none), and the prose fallback applies only when no surface exists and says so in one line (`.skilled/repo-rules/communication-handoff.md`). Verify: `rg -n "AskUserQuestion|request_user_input|ask_user_question" AGENTS.md .skilled/repo-rules` hits §5 lines only. Evidence: version 1.6.0.7; `check-repo-rules.cjs` RESULT: PASSED (11/11); tool names only on §5 rows 157-162.
- [x] T005 Point Gate 3's options line at the §5 surface in a byte-neutral edit (`AGENTS.md`). Verify: `agents-md-check.cjs` A6 prints at most 16384 bytes to the last anchor. Evidence: operator approved the diff; A6 prints 16379 of 16384, `agents-md-check` STATUS=OK findings=0.
- [x] T006 Re-mint the AGENTS.md manifest (`.skilled/commands/doctor/assets/agents-md-manifest.json`). Verify: `agents-md-manifest.cjs --check` exits 0. Evidence: `agents-md-manifest.cjs --check` PASS; `check-rule-copies.js` exit 0.
- [x] T007 Write the ten detector fixtures (`G/fixtures/`). Verify: `ls G/fixtures | wc -l` prints 10. Evidence: 10 fixtures.
- [x] T008 Write `detectProseMenu`, `evaluateTurn` and the per-turn marker with tests (`G/lib/ask-surface-core.cjs`). Verify: `node --test G/lib/ask-surface-core.test.mjs` prints `fail 0` with every fixture at its expected verdict. Evidence: 16 pass, 0 fail.
- [x] T009 Write the synchronous Claude Stop guard with tests (`G/claude/ask-surface-stop.cjs`). Verify: its test shows one `{"decision":"block"}` for a firing payload and empty stdout for `stop_hook_active: true`, the kill switch and a malformed payload. Evidence: 6 pass, 0 fail.
- [x] T010 [P] Write the DSH guard with tests (`G/dsh/ask-surface-guard.mjs`). Verify: the harness test shows one `agent.steer` call for a firing turn and none for a second fire, headless or disabled. Evidence: 7 pass, 0 fail, including the headless-profile check.
- [x] T011 [P] Write the OpenCode guard with tests (`.opencode/plugins/ask-surface-guard.js`). Verify: `node --test .opencode/plugins/tests/ask-surface-guard.test.cjs` shows one `promptAsync` call for a firing turn and none for a repeat. Evidence: 3 pass, 0 fail.
- [x] T012 [P] Write the Pi guard with tests (`G/pi/ask-surface-guard.ts`). Verify: the vitest shows one `sendMessage` with `deliverAs: "followUp"` and `triggerTurn: true` for a firing turn. Evidence: vitest 4 passed.
- [x] T013 [P] Write the advisory Codex and Devin adapters with tests (`G/codex/ask-surface-stop.cjs`, `G/devin/ask-surface-stop.cjs`). Verify: each test shows a stderr advisory and no block envelope. Evidence: 4 pass, 0 fail.
- [x] T014 Register the Claude, Codex and Devin bindings and regenerate the configs (`hook-registry.json`). Verify: `S --check` exits 0 and the Claude Stop binding has no `async` key. Evidence: `--check` PASS, 34-hook registry; the Claude Stop entry carries `timeout: 5` and no `async`.
- [x] T015 Link the Pi, DSH and OpenCode adapters into their runtimes (`.pi/extensions/`, `.dsh/plugins/repo-guards/`, `.opencode/plugins/tests/plugin-inventory.json`). Verify: `S --check` exits 0 and `plugin-inventory.test.cjs` passes. Evidence: `--check` reports 21 Pi extensions resolve; plugin-inventory suite passes; bundle registers 3 turn-stopping handlers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T016 Update the binding count (`hook-registration-sync.vitest.ts`). Verify: the vitest passes at the new count. Evidence: count 108; registry sync vitest 7 passed, path parity 140 passed.
- [x] T017 Document the concern and its kill switch (`.skilled/hooks/README.md`, `coverage-rationale.md`, `hook-flags.env.example`). Verify: `rg -n "SYSTEM_ASK_SURFACE_DISABLED"` hits all three. Evidence: the flag row in `README.md` and `hook-flags.env.example`; the concern section in `coverage-rationale.md`.
- [x] T018 Run every hook test lane (`.skilled/hooks/`). Verify: the node:test and vitest lanes both print zero failures. Evidence: node:test lane 74 files, 1476 pass, 0 fail; vitest lane 9 files, 487 passed.
- [x] T020 Log every fire to the project's gitignored state folder so live runs can count them (`.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs`). Verify: every adapter test asserts its `fires.jsonl` line; 37 node:test and 4 vitest pass; no file appears under the real repo's `.skilled/skills/.state/ask-surface/`. Evidence: as stated.
- [x] T021 Write the live, kill-switch and no-false-positive conversation scenarios and index them (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/`). Verify: `validate-playbook-package.cjs --package system-spec-kit` reports no violation in the three files. Evidence: its only two violations are pre-existing session-relaunch links into the deleted `specs/hooks/` tree.
- [x] T022 Run the scenarios live on Claude Code, OpenCode, Pi and Devin (`run-conversation-scenario.cjs`). Verify: each `matrix.md` lists one verdict per runtime. Evidence: 12 PASS across four scenarios, Devin split into its own advisory scenario; report `.skilled/skills/system-spec-kit/benchmark/reports/2026-11-08--manual-testing-playbook--ask-surface-guard/`, runs in `scratch/live-runs/`.
- [x] T019 Validate the packet (`spec folder`). Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: Errors 0, Warnings 1, `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`: T001 to T022 are checked
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: 12 live conversation runs PASS, report `.skilled/skills/system-spec-kit/benchmark/reports/2026-11-08--manual-testing-playbook--ask-surface-guard/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-007, each mapped to an AC row
- [x] CHK-002 [P0] Technical approach defined in plan.md: shared detector plus one adapter per runtime
- [x] CHK-003 [P1] Dependencies identified and available: `hook-flags.cjs`, `hook-registry.json` sync script and the DSH plugin harness all resolve in the tests
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks: `node --check` on the 12 JavaScript files, 0 failures; Pi vitest compiles and passes
- [x] CHK-011 [P0] No console errors or warnings: the OpenCode plugin writes nothing to stdout or stderr, and the advisory adapters write stderr only on a fire, both asserted in their tests
- [x] CHK-012 [P1] Error handling implemented: every adapter fails open; the throwing-session, failing-client and malformed-payload tests pass
- [x] CHK-013 [P1] Code follows project patterns: `.skilled/hooks/<concern>/<runtime>/` layout, `isHookEnabled` kill switch, registry-generated configs; comment hygiene exit 0
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` is Met
- [x] CHK-021 [P0] Manual testing complete: four conversation scenarios, 12 runs PASS on Claude Code, OpenCode, Pi and Devin
- [x] CHK-022 [P1] Edge cases tested: fenced, quoted, single-option, numbered-steps and summary fixtures pass; re-entrant stop and second stop per turn tested
- [x] CHK-023 [P1] Error scenarios validated: malformed payload, throwing session read and failing client each leave the turn as it was
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets: `rg` for key, secret, token and password assignments over the guard files returns no hit
- [x] CHK-031 [P0] Input validation implemented: non-string and empty messages pass, and bad JSON on stdin exits 0 silently
- [x] CHK-032 [P1] Auth/authz working correctly: N/A, the guard reads local turn data and calls no authenticated service
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: strict validation passes, and the summary, criteria and tasks all record completion
- [x] CHK-041 [P1] Code comments adequate: each adapter heads with why its runtime needs a send-back, with no ids in comments
- [x] CHK-042 [P2] README updated (if applicable): `.skilled/hooks/README.md` lists the concern, its kill switch and its coverage row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only: run evidence sits in `scratch/live-runs/`, and the tests write markers and fire logs to temp folders
- [x] CHK-051 [P1] scratch/ cleaned before completion: what remains is evidence the run report cites, with whole-repository snapshots replaced by checksums (13 MB)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-08
<!-- /ANCHOR:summary -->

---



