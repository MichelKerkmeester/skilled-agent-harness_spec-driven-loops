---
title: "Tasks: Phase 7: gap-closure"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "gap closure tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: gap-closure

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

`$DC` is `.skilled/hooks/decision-capture`. `$RT` is `.skilled/skills/system-spec-kit/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline the fixes must change (`spec.md` Measured Behavior). Verify: the seven commands there print the quoted output. Evidence: the seven commands printed the quoted output before any edit.
- [x] T002 Record the suite baseline (`implementation-summary.md`). Verify: `node --test $DC/{lib,bin,claude,devin}/*.test.mjs` reports `pass 101 fail 0`. Evidence: `pass 101 fail 0` before any edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Report an unreadable transcript in the Codex sweep (`$DC/bin/sweep-codex.mjs`, `sweep-codex.test.mjs`). Verify: `node $DC/bin/sweep-codex.mjs --transcript missing.jsonl` prints JSON with `error` and exits 1. Evidence: `{"error":"ENOENT..."}`, exit 1; suite 12 of 12.
- [x] T004 Report an unreadable transcript in the Pi sweep (`$DC/bin/sweep-pi.mjs`, `sweep-pi.test.mjs`). Verify: the same command for `sweep-pi.mjs` prints `error` and exits 1; `--transcript /dev/null` prints nothing and exits 0. Evidence: `error`, exit 1; `/dev/null` prints nothing, exit 0; suite 11 of 11.
- [x] T005 Amend NFR-R02 in `../003-codex-and-pi-capture/spec.md`. Verify: `rg -n 'NFR-R02' ../003-codex-and-pi-capture/spec.md` names exit 1 for an unreadable transcript. Evidence: NFR-R02 now names exit 1 with an `error` field.
- [x] T006 Show the pending count on Pi at `turn_end` (`$DC/pi/decision-capture.ts`, `decision-capture.test.ts`). Verify: the Pi vitest passes with a case where one turn notifies and the next does not. Evidence: Pi vitest 9 of 9, including one notify then none.
- [x] T007 Load `node:sqlite` lazily in the OpenCode sweep (`$DC/bin/sweep-opencode.mjs`). Verify: `bun -e "import('./$DC/bin/sweep-opencode.mjs')"` loads. Evidence: Bun prints `loaded`; suite 10 of 10.
- [x] T008 Make the OpenCode plugin use `openCodeAnswerRecords` (`.opencode/plugins/decision-capture.js`). Verify: `rg -c answerMap .opencode/plugins/decision-capture.js` prints nothing and the plugin test passes. Evidence: `rg -c answerMap` prints nothing; plugin test 6 of 6; Bun prints `loaded`.
- [x] T009 Export one consumed-log row reader from the writer and use it in the matcher CLI (`$RT/lib/continuity/decision-record-writer.ts`, `$RT/cli/continuity/match-decision-table.ts`). Verify: `rg -c 'CONSUMED_FILENAME|readConsumedLines' $RT/cli/continuity/match-decision-table.ts` prints nothing. Evidence: `rg -c` prints nothing; CLI suites 72 of 72.
- [x] T010 List other sessions' pending answers at save and drop the filter restatement (`.skilled/commands/speckit/save.md`). Verify: `rg -n 'scan-orphans' .skilled/commands/speckit/save.md` prints a line. Evidence: `rg -n scan-orphans` prints save.md:70.
- [x] T011 [P] Write the decision-capture section (`.skilled/hooks/coverage-rationale.md`) and update the docs that called a Codex or Pi read failure silent. Verify: `rg -n 'decision-capture' .skilled/hooks/coverage-rationale.md` prints the section heading. Evidence: coverage-rationale.md section present; runtime-refusal test 6 of 6.
- [x] T016 Read pi-plan-build's `question` tool on Pi (`$DC/bin/sweep-pi.mjs`, `$DC/pi/decision-capture.ts` and their tests). Verify: sweeping the second live pass's failing Pi session recovers its `Amber` answer. Evidence: `recovered: 1`, `answer: Amber`; sweep suite 12 of 12, Pi vitest 10 of 10; the new sweep test fails with `question` removed from the tool set.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun every decision-capture suite. Verify: hooks `node --test` reports `fail 0`, the Pi vitest and the OpenCode plugin test pass, the runtime CLI suites report no failure. Evidence: hooks 101 of 101, Pi 9 of 9, plugin 6 of 6 and 81 of 81, CLI 72 of 72, session-stop 19 of 19.
- [x] T013 Rerun typecheck, lint and the CLI build (`$RT`). Verify: `npm run -s typecheck`, `npx eslint` on the changed files and `npm run -s build` each exit 0. Evidence: typecheck, CLI tsc, eslint and build each exit 0.
- [x] T014 Rerun the Measured Behavior commands. Verify: each closed gap prints its new output. Evidence: each closed gap printed its new output (implementation-summary Verification).
- [x] T015 Validate the series. Verify: `validate.sh specs/system-speckit/043-decision-capture --strict --recursive` prints RESULT: PASSED for every folder. Evidence: 8 folders, each RESULT: PASSED, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the Bun import of the plugin loads
- [x] Every row of `acceptance-criteria.md` reads Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Research**: See `../research/research.md`
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

A blocked task carries `[B]` and the command output that blocks it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7. Evidence: 7 rows.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c YOUR_VALUE_HERE plan.md` prints nothing. Evidence: no placeholder.
- [x] CHK-003 [P1] Dependencies available: `command -v codex pi bun` prints three paths. Evidence: `command -v codex pi bun` printed three paths.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The sk-code quality gate over the changed code files reports `NO_BLOCKER_FOUND`. Evidence: `NO_BLOCKER_FOUND`, no findings.
- [x] CHK-011 [P0] Runtime typecheck and lint exit 0. Evidence: typecheck and eslint exit 0.
- [x] CHK-012 [P1] Every new catch handles what it catches: the Pi nudge stays inside the extension's existing fail-open catch. Evidence: the `turn_end` handler sits in its own fail-open catch.
- [x] CHK-013 [P1] No ephemeral labels in new comments: `git diff -U0 | rg '^\+.*//.*(REQ-|CHK-|T0[0-9]{2}|007)'` prints nothing. Evidence: no hit over the 11 changed code files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row of acceptance-criteria.md reads Met.
- [x] CHK-021 [P0] The Bun import of the plugin loads. Evidence: `loaded`.
- [x] CHK-022 [P1] Edge cases tested: a readable empty transcript stays quiet on Codex and Pi. Evidence: `--transcript /dev/null` prints nothing, exit 0, on both.
- [x] CHK-023 [P1] Error scenarios validated: a missing named transcript exits 1 with `error` on Codex and Pi. Evidence: exit 1 with `error` on both.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: unreadable transcript `class-of-bug`, orphaned answers `instance-only`, Pi nudge `instance-only`, OpenCode mapping `cross-consumer`, consumed-log reader `cross-consumer`, filter prose `instance-only`. Evidence: classes listed in the item.
- [x] CHK-FIX-002 [P0] Same-class producers: all five sweeps checked; three already report a read error. Evidence: five sweeps checked.
- [x] CHK-FIX-003 [P0] Consumer inventory completed in `plan.md` FIX ADDENDUM. Evidence: plan.md FIX ADDENDUM.
- [x] CHK-FIX-004 [P0] N/A: no security, path or redaction parser changes. Evidence: no parser or path change.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: named or discovered, by readable, unreadable or empty. Evidence: four rows in plan.md.
- [x] CHK-FIX-006 [P1] Hostile env variant: the Pi nudge test runs with `SYSTEM_DECISION_CAPTURE_DISABLED=1` and shows nothing. Evidence: the kill-switch test registers no `turn_end` handler and notifies nothing.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the commit that lands this phase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or home paths in changed files: `git diff | rg '^\+.*(/Users/|sk-[A-Za-z0-9]{20})'` prints nothing. Evidence: no hit over the changed code files.
- [x] CHK-031 [P0] Input validation unchanged: the matcher still exits 2 on a project root that is not a directory. Evidence: the not-a-directory test passes in the 72.
- [x] CHK-032 [P1] N/A: no auth surface. Evidence: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same six changes. Evidence: all three name the same six changes.
- [x] CHK-041 [P1] `save.md`, `save-workflow.md`, the hooks README and the feature catalog agree on the Codex and Pi read-error behavior. Evidence: save.md, the catalog and the hooks docs agree; save-workflow.md says nothing about the read error.
- [x] CHK-042 [P2] The 003 NFR-R02 amendment names this phase's operator approval. Evidence: NFR-R02 names the operator go-ahead.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: workers wrote only to the named files; scratch files stayed in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: no scratch/ folder in this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-02
<!-- /ANCHOR:summary -->

---
