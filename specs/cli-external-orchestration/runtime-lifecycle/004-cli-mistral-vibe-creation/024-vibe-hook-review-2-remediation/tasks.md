---
title: "Tasks: Phase 24: vibe-hook-review-2-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe hook review 2 remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 24: vibe-hook-review-2-remediation

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

`G` is `.vibe/plugins/repo-guards/`. `L` is `.skilled/hooks/session-lifecycle/vibe/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the verified findings, the decisions and the cited lines (`../review/review-report.md` sections 3, 4, 6 and 8). Verify: every cited line still matches the report; none was skipped.
- [x] T002 Record the baseline counts before the first edit (the four suites in the brief). Verify: 17 pass, 45 pass, 1040 pass and 11 pass, each `fail 0`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the `process.start` payload cases for the four shell guards (`G/tests/env-secret-guard.test.mjs`, `spec-gate.test.mjs`, `git-message-gate.test.mjs`, `dispatch-preflight.test.mjs`). Verify: on the old map `node --test G/tests/` prints `fail 4`, each failing on `process.start`.
- [x] T004 Map `process.start` to `bash` and fix the payload spelling in the docs (`G/lib/hook-io.mjs`, `G/fixtures/wire-format/tool-names.md`, `guards-and-hooks.md`). Verify: `node --test G/tests/` prints `fail 0`.
- [x] T005 [P] State why the advise branch does not call `observe()` and that the note repeats (`G/spec-gate.mjs`). Verify: `rg -n "deliberately not called" G/spec-gate.mjs` prints one line.
- [x] T006 Binding scope and delivery: subagent skip, overlay-guard match, 9000 ms startup-guard budget, quiet nudge catch (`L/compaction-context.mjs`, `.vibe/hooks.toml`, `L/session-start.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`). Verify: the subagent, budget and nudge cases each fail on the old file and pass on the new one.
- [x] T007 One cwd rule and the existing-directory rule for the writers (`G/lib/hook-io.mjs`, `G/dist-freshness.mjs`, `G/dispatch-preflight.mjs`, `L/turn-start.mjs`, the ask-capture, completion and ask-surface adapters). Verify: the two missing-folder cases in `L/turn-end.test.mjs` fail on the old adapters and pass on the new ones.
- [x] T008 [P] Hardening: dynamic import in session-cleanup, whole command values in the renderer (`G/session-cleanup.mjs`, `G/render-home-hooks.cjs`). Verify: the multi-line case fails on the old renderer; a missing module exits 0 with one stderr line, where the old file exited 1.
- [x] T009 [P] Doc drift (`guards-and-hooks.md` lines 37, 122, 131, the reply table and the `process.start` row; `L/README.md` line 29). Verify: `rg -n "one of them strict|not ported|OPENCODE_GOAL_DISABLED" <both docs>` prints four lines.
- [x] T010 Testability: session-start entry gate and exported parts, the shared stdin reader, a deep-loop-guard test, env threading (`L/session-start.mjs`, `L/turn-start.mjs`, `L/turn-end.mjs`, `L/compaction-post-tool.mjs`, `G/tests/deep-loop-guard.test.mjs`, `prompt-advisor.mjs`, the two adapters). Verify: `rg -n "async function readStdin" L` prints nothing, and the receipt case fails on the old advisor.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun the four suites from the brief (`node --test`). Verify: 28, 55, 1041 and 11 pass, each `fail 0`, exit 0.
- [x] T012 Record a disposition for every finding V01 to V26 (`implementation-summary.md`). Verify: each id appears in the disposition table.
- [x] T013 Strict validation of this folder (`validate.sh`). Verify: it prints `RESULT: PASSED`.
- [x] T014 Live VIB-HK-029 background-shell scenario run by the orchestrator (`hook-scenarios/process-start-shell-guard.md`). Verify: its `result.json` reads `"verdict": "PASS"` with the model recorded.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: VIB-HK-029 live
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: See `../review/review-report.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the installed Vibe source read for the payload name and the 60 s default timeout
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `node --check` on each changed module exits 0
- [x] CHK-011 [P0] No console errors or warnings in the unit suites
- [x] CHK-012 [P1] Error handling implemented: every changed hook path still fails open
- [x] CHK-013 [P1] Code follows project patterns: comments state the reason and carry no finding, task or phase ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: VIB-HK-029 live, run by the orchestrator: PASS 2/2 on `deepseek-flash`, `scratch/live/VIB-HK-029/vibe/result.json`
- [x] CHK-022 [P1] Edge cases tested: a missing payload folder, a subagent payload, a multi-line command, a switched-off part, empty guard output
- [x] CHK-023 [P1] Error scenarios validated: a throw under the nudge claim, a missing OpenCode module
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: see the disposition table in `implementation-summary.md`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory for the tool-name map: `CORE_TOOL_NAMES` is the only one (`rg -n "process_start" .vibe .skilled/hooks`); deep-loop-guard keeps its own spawn-name set, which already holds `agents.spawn`. A second route into a shell, `process.write` to a started process's stdin, has no binding at all; it is recorded under Known Limitations, not fixed here.
- [x] CHK-FIX-003 [P0] Consumer inventory: every shell guard reads `toCoreCall`; both writer and reader pairs changed together; no shared core changed.
- [x] CHK-FIX-004 [P0] Path fix adversarial cases: a missing absolute child of a temp folder for both writers, a relative cwd refused by `existingDirectory`, and the existing folder still written.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: two tool names by four shell guards, eight rows.
- [x] CHK-FIX-006 [P1] Hostile env variant: the guard tests strip every `*_DISABLED` switch and point `HOOK_FLAGS_CONFIG` at an absent file.
- [x] CHK-FIX-007 [P1] Evidence is pinned to `22dfa2c86bd` plus this phase's working-tree diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the tests build the dotenv command from parts and read no real dotenv file
- [x] CHK-031 [P0] Input validation implemented: the payload folder must be an existing absolute directory before a write
- [x] CHK-032 [P1] Auth/authz: not applicable, the hooks run as the operator
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated: the session-lifecycle README names the goal switch
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: test folders are OS temp folders removed by each case
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
