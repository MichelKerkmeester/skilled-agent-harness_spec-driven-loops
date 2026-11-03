---
title: "Tasks: Phase 3: codex-and-pi-capture"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "codex and pi capture tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: codex-and-pi-capture

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

Shell variables used below: `DC` is `.skilled/hooks/decision-capture`. `PR` is `.skilled/skills/.state/decision-capture/probe`.

Precondition for T005 and T009: the operator has consented to the live probe, and the probe asks one harmless question with no real decision in it. Without consent those two tasks do not run, and the plan's no-surface branch applies to that runtime's live hook.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Re-run the baseline count (`scratch/measure-answer-surfaces.sh`). Verify: from the repo root, `bash specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/scratch/measure-answer-surfaces.sh` exits 0 and prints `pi files with an answered one (cancelled:false):` and `accepted calls followed by a user message:` lines; any change from the spec's Measured Behavior block is written into `implementation-summary.md`. Evidence: Exit 0; both named lines print (108 answered Pi files; 2 accepted calls followed by a user message). The changes from the spec block are in the summary's Verification table.
- [x] T002 Re-run the Pi offline probe under the registered name `ask_user_question` and record the observed toolResult shape (`$PR/pi.json`). Verify: `jq -r '.status, .method' $PR/pi.json` prints `transcript-observed, hook UNKNOWN` and a method naming `ask_user_question`. Evidence: The offline scan ran under `ask_user_question` (132 files, 300 results, named in `.method`). The live probe in T009 then replaced the status with `observed: hook and transcript both carry the answer`, so the `hook UNKNOWN` string is superseded with AC-001 (`decision-record.md` ADR-001).
- [x] T003 [P] Build a redacted Pi fixture from one real answered toolCall and toolResult pair (`$DC/bin/fixtures/pi-ask-user-question.json`). Verify: `jq '[.. | objects | select(has("answers")) | .answers | length] | add' $DC/bin/fixtures/pi-ask-user-question.json` prints 2 or more, and `rg -n "$HOME|michelkerkmeester" $DC/bin/fixtures/pi-ask-user-question.json` prints nothing. Evidence: `jq` prints 4; the `rg` prints nothing.
- [x] T004 Record the operator's consent for the live Codex and Pi probes (`implementation-summary.md`). Verify: `rg -n 'Operator consent' implementation-summary.md` prints one line naming both runtimes, or the line records which probe was refused. Evidence: The `rg` prints one line naming Codex and Pi, quoting "Yes, all four (Recommended)", parent Q007.
- [x] T005 Run the live Codex probe: in a scratch project with a temporary PostToolUse hook that writes its stdin to a file, start an interactive Codex session in Plan mode, have it call `request_user_input_async` with one harmless question, and answer it (`$PR/codex.json`). Verify: `jq -r .status $PR/codex.json` no longer prints `UNKNOWN`, `.hook_payload` and `.transcript` start with `OBSERVED:`, and `git diff --quiet -- .codex/hooks.json` exits 0. Evidence: Status `observed: hook and rollout both tie the answer to its call`; `.hook_payload` and `.transcript` start with `OBSERVED:`; `git diff --quiet -- .codex/hooks.json` exits 0. The probe ran in default mode with `default_mode_request_user_input` on, where Codex calls the synchronous `request_user_input`; the async tool only returns `{"accepted":true}` (ADR-001, AC-011).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T006 Add the Pi save-time reader on the `sweep-devin.mjs` pattern: `--transcript <path>` or the newest session file for the project, `ask_user_question` results only, cancelled results skipped (`$DC/bin/sweep-pi.mjs`). Verify: `node --check $DC/bin/sweep-pi.mjs` exits 0. Evidence: `node --check` exits 0.
- [x] T007 Add the Pi reader tests: answered queues one line per question, cancelled queues none, a second run adds none, a missing file exits 0 (`$DC/bin/sweep-pi.test.mjs`). Verify: `node --test $DC/bin/sweep-pi.test.mjs` reports `fail 0`, and fails when the reader reads a wrong field. Evidence: 9 pass, 0 fail; with the multi-select read broken, 4 fail. A later error-result case fails 1 when the reader stops skipping `isError`.
- [x] T008 Take one Codex branch from the T005 result. Branch (a), the reply is tied to its call: add `sweep-codex.mjs`, its test and a redacted fixture from the probe. Branch (b), it is not: set the README Codex cell to `n/a:` with the observed reason and add a test that pins the cell and `$PR/codex.json` status (`$DC/bin/sweep-codex.test.mjs` or `$DC/bin/runtime-refusal.test.mjs`). Verify: the chosen test file passes under `node --test` and fails when its fixture or README cell is changed. Evidence: Branch (a): `sweep-codex.mjs`, its test and `fixtures/codex-request-user-input.json`. 8 pass, 0 fail; with the note prefix broken, 1 fails.
- [x] T009 Run the live Pi probe: in a scratch project with a temporary extension that logs the `tool_result` event's keys for `ask_user_question`, answer one harmless question, then record whether `event.details.answers` is present (`$PR/pi.json`). Verify: `jq -r .hook_payload $PR/pi.json` starts with `OBSERVED:`. Evidence: `.hook_payload` starts with `OBSERVED:` and names `event.details.answers[]`.
- [x] T010 Register a Pi extension only when T009 observed `details.answers`; otherwise record "not registered" and the reason (`.pi/extensions/decision-capture.ts`, `hook-registry.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints PASS, and `jq -r .adapter $PR/pi.json` matches what was done. Evidence: Registered: `.pi/extensions/decision-capture.ts` links to `pi/decision-capture.ts`; `--check` prints PASS with 19 Pi extensions resolving, and `.adapter` reads `registered: ...`.
- [x] T011 [P] Update the `decision-capture` coverage row and the `bin/` tree line (`.skilled/hooks/README.md`). Verify: `rg -n '^\| .decision-capture. \|' .skilled/hooks/README.md` shows Codex and Pi cells that match the probe files. Evidence: The row shows Codex `by-design:` with the rollout sweep and Pi `✓ covered`, matching both probe files; the tree lists `sweep-codex.mjs`, `sweep-pi.mjs` and `pi/`.
- [x] T012 [P] Name the Pi reader, and the Codex reader if branch (a) ran, beside the OpenCode and Devin ones (`.skilled/commands/speckit/save.md`). Verify: `rg -n 'sweep-pi.mjs' .skilled/commands/speckit/save.md` prints at least one line. Evidence: The `rg` prints 2 lines.
- [x] T013 [P] List the new reader and test files (`.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md`). Verify: `rg -c 'sweep-pi' .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` prints 2 or more. Evidence: `rg -c` prints 3.
- [x] T018 Drop the `process.cwd()` fallback from the Claude adapter and add the no-project test (`.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`). Verify: the AC-008 case passes. Evidence: The AC-008 case passes; 2 pass, 0 fail, and with the fallback restored 1 fails.
- [x] T019 Generalize `runtime-refusal.test.mjs` to pin every `n/a:` cell, the series convention for a runtime with no answer surface (`$DC/bin/runtime-refusal.test.mjs`). Verify: the AC-009 before and after runs. Evidence: 6 pass before; a bare `n/a` cell and an unlisted `n/a:` cell in a temporary README copy each fail 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T014 Run every decision-capture test (`$DC/`). Verify: `node --test $DC/lib/*.test.mjs $DC/bin/*.test.mjs` reports `fail 0`. Evidence: 78 pass, 0 fail, 2026-11-02.
- [x] T015 Check the probe states (`$PR/`). Verify: `jq -r .status $PR/codex.json $PR/pi.json` prints no `UNKNOWN` line. Evidence: No `UNKNOWN` line.
- [x] T016 Re-prove capture with the live-conversation harness: an orchestrator drives a real multi-turn Codex session and a real multi-turn Pi session in a scratch project and answers the subject's questions as the human (`../006-live-conversation-test/`). Verify: the 006 results matrix has a Codex row and a Pi row, each marked capturing (one queue line per answer, no duplicates) or no answer surface, each with its evidence. Evidence 2026-11-02: Pi main 14/14, capturing live, 6 queue lines, 0 duplicate keys, 7 rows; Codex main PASS on attempt 7, capturing at save time, 6 rollout-swept queue lines, 0 duplicate keys, 7 rows, a repeat save identical (`../006-live-conversation-test/scratch/live-runs/{pi,codex}-run1/`).
- [x] T017 Validate this packet (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/043-decision-capture/003-codex-and-pi-capture --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED`, Errors 0, Warnings 0, on 2026-11-02 before the live re-proof. Rerun after T016.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed Evidence: the 006 Pi and Codex runs.
- [x] The 006 results matrix carries a Codex row and a Pi row with evidence. Evidence: both rows read PASS in `../006-live-conversation-test/implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Finished build**: See `../001-decision-capture-build/` (tasks T016 and T018 hold the probes this child replaces)
- **Live re-proof**: See `../006-live-conversation-test/`
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

A task blocked by missing operator consent is marked `[B]` with the refused probe named, and the packet does not close until the operator consents or a decision record waives it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7. Evidence: Prints 9: REQ-008 (the Claude adapter fallback) and REQ-009 (the refusal convention) were added after this check was written.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n 'Save-time session reader' plan.md` prints one line. Evidence: One line.
- [x] CHK-003 [P1] Dependencies identified and available: `jq -r '.packages[]' .pi/settings.json` lists `npm:@juicesharp/rpiv-ask-user-question`, and `codex --version` exits 0. Evidence: The package is listed and `codex --version` prints `codex-cli 0.164.0`, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check` exits 0 for every new `.mjs` file under `$DC/bin/`. Evidence: `node --check` exits 0 for every `.mjs` under `bin/`.
- [x] CHK-011 [P0] A reader run prints nothing on stdout when it queues nothing: `node $DC/bin/sweep-pi.mjs --transcript /dev/null` prints no output and exits 0. Evidence: No output, exit 0.
- [x] CHK-012 [P1] Error handling implemented: a malformed session line is skipped, covered by a case in `sweep-pi.test.mjs`. Evidence: The malformed-line case passes.
- [x] CHK-013 [P1] Code follows project patterns: the reader imports `appendRecords` and `normalizeAskUserQuestion` from `lib/capture-core.mjs` and carries the component header box, as `sweep-devin.mjs` does. Evidence: Both readers import `appendRecords` and `normalizeAskUserQuestion` from `lib/capture-core.mjs` and carry the component header box.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met: every row in `acceptance-criteria.md` reads `Met`, `Waived` or `Superseded`. Evidence 2026-11-02: no row reads Unmet.
- [x] CHK-021 [P0] Manual testing complete: T005, T009 and T016 each have recorded evidence. Evidence: T005, T009 and T016 each carry recorded evidence.
- [x] CHK-022 [P1] Edge cases tested: cancelled, multi-question and rerun cases pass in `sweep-pi.test.mjs`. Evidence: The four-answer fixture, cancelled and rerun cases pass.
- [x] CHK-023 [P1] Error scenarios validated: a Codex call rejected for bad arguments queues nothing in the branch (a) test, or branch (b) applies. Evidence: Branch (a): a Codex output holding plain error text queues nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

The finding this packet fixes: the 001 Codex and Pi probes searched for tool names neither runtime records.

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Here: `class-of-bug`, a probe keyed on an assumed tool name. Evidence: Classed `class-of-bug`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep: `jq -r .method $PR/*.json` checked for all four probe files. Evidence: `jq -r .method` on all four probe files names each runtime's real tool and how it was observed live.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests: `rg -n 'probe/(codex|pi)\.json|sweep-(pi|codex)' .skilled --glob '!node_modules'` lists every reader of the changed names. Evidence: The `rg` lists `save.md`, the README, the feature catalog, the Pi extension and its test, both reader tests and `capture-core.test.mjs`.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Here: the fixture redaction check in T003, plus a test that a `--transcript` path outside the Pi sessions directory is still read only, never written. Evidence: The T003 redaction check prints nothing, and the "transcript bytes remain unchanged" case proves the reader never writes the session file.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: runtime (2) by result (answered, cancelled, rejected, multi-question), 8 rows. Evidence: Rows: Codex and Pi by answered, cancelled, rejected and multi-question, 8, each covered by a reader test case.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state: the reader tests run with `HOME` pointed at a temp directory. Evidence: Both reader test files run every CLI case with `HOME` (and `CODEX_HOME` for Codex) set to a temporary directory.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets, home paths, session ids or call ids in any fixture: `rg -n "$HOME|michelkerkmeester" $DC/bin/fixtures/` prints nothing. Evidence: The `rg` over `bin/fixtures/` and `devin/fixtures/` prints nothing.
- [x] CHK-031 [P0] Input validation implemented: the reader ignores any record whose `toolName` is not `ask_user_question`, covered by a test case. Evidence: The cancelled-and-other-tool case passes.
- [x] CHK-032 [P1] The probe scratch projects and their temporary hook or extension are deleted after T005 and T009: `git status --short .codex .pi` shows no change. Evidence: The probe projects and their temporary hook and extension were deleted, and both Codex trust entries removed. `git status --short .codex .pi` shows only the operator-approved flag in `.codex/config.toml` (parent Q006) and the registered extension link (T010).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec, plan and tasks name the same Codex branch once T005 decides it. Evidence: spec.md, plan.md and tasks.md each name branch (a).
- [x] CHK-041 [P1] The reader's header comment states why cancelled results are skipped. Evidence: The `sweep-pi.mjs` header says cancelled prompts contain no operator decision.
- [x] CHK-042 [P2] `.skilled/hooks/README.md`, `save.md` and the feature catalog agree on the Pi and Codex readers. Evidence: The README row, `save.md` and the catalog all name the Codex rollout reader and the Pi extension plus reader.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only: probe output that is not a fixture stays in this packet's `scratch/` or in `$PR/`. Evidence: Probe output sits in `scratch/` or `$PR/`.
- [x] CHK-051 [P1] scratch/ cleaned before completion, keeping only `measure-answer-surfaces.sh`. Evidence: `scratch/` holds only `measure-answer-surfaces.sh` and `.gitkeep`. The raw Pi probe log held real ids and was moved out; the redacted fixtures carry its evidence.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---
