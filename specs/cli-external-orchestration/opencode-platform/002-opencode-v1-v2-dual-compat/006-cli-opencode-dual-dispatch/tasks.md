---
title: "Tasks: Phase 6: cli-opencode-dual-dispatch"
description: "Task Format: T### [P?] Description (file path). Each task names its executor at the end of the line."
trigger_phrases:
  - "cli opencode dual dispatch tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: cli-opencode-dual-dispatch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed, with evidence in the log |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) (executor)`

Executors: **Luna** is GPT-6 Luna max fast through cli-codex. **DeepSeek** is DeepSeek V4.1 Flash max through cli-devin. **Orchestrator** is the operator session that runs every test and live probe.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the deep-loop runtime suite and save its output under `scratch/`. Record the pass count, the fail count and the file count. This suite is not in the 001 baseline. (`.skilled/skills/system-deep-loop/runtime`) (Orchestrator) Evidence: scratch/deep-loop-suite-before.txt, 166 files, 2718 passed, 8 skipped.
- [x] T002 [P] Copy `fanout-run.cjs` and `SKILL.md` to `scratch/backup/`. (Orchestrator) Evidence: taken before the first edit, deleted at closeout (decision 20).
- [x] T003 Rerun the line check. The four sites must sit at lines 2258, 2324, 2923 and 2961. Stop if they moved. Run `rg -n 'buildNativeLineageCommand|buildOpencodeLineageCommand|isOpencodeBinaryAvailable|resolveExecutableVersion' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) (Orchestrator) Evidence: scratch/line-check.txt, all four at the expected lines (decision 1).
- [x] T004 Run the three live probes in `scratch/probes/`, using `run --standalone` in a scratch project. Probe the working directory with and without a positional path (Q3). Probe a bare `/family:name args` message (Q2). Probe the child environment with a fixture plugin that logs `AI_SESSION_CHILD`. Read the process list before and after, and record both. (Orchestrator) Evidence: scratch/probes/, decisions 2 to 6; process lists in probes/ps-before.txt and ps-after.txt.
- [x] T005 Settle Q1 to Q5 from the T004 output. Amend spec.md or plan.md if a probe changed the design, and name the amendment in the log. (`spec.md`, `plan.md`) (Orchestrator) Evidence: decisions 7 to 11. Amendments: plan.md section 3, the v2 `--auto` flag (decision 5) and the per-directory PATH order (decision 10).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Write the red tests first. Cover rows P1 to P5, A1 to A3 and D1 to D4 in plan.md, the adversarial table, and the cache count. (`.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`) (Luna) Evidence: the new file, 23 cases; three test defects fixed by the orchestrator (decision 13).
- [x] T007 Run the T006 suite and record the first failing assertion for each case. This is the negative control. (Orchestrator) Evidence: scratch/red-first-failures.txt, 21 of 23 fail first; D1 and D3 pin today's argv (decision 14).
- [x] T008 Create the resolver. It uses `$OPENCODE_BIN` when set, otherwise it walks PATH and takes `opencode2` before `opencode` inside each directory (amended, decision 10 in `scratch/decisions.txt`), runs `--version` through an argv array, parses the output, refuses what does not parse, and caches by realpath, size and mtime. (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`) (Luna) Evidence: scripts/opencode-version.cjs; PATH order amended to per-directory (decision 10).
- [x] T009 Add the v1 renderer and the v2 renderer to `buildOpencodeLineageCommand` (line 2324) and `buildNativeLineageCommand` (line 2258). The v2 renderer adds `run --standalone`, uses `#variant`, sets the spawn cwd, and drops the v1-only flags. The v2 native branch fails closed until Q2 is decided. (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) (Luna) Evidence: fanout-run.cjs both builders; D1 to D4 pass (scratch/green-run.txt).
- [x] T010 Route the table entry at line 2923 and the availability check at line 2961 through the resolver. The check accepts `opencode2` alone, and the error names both binaries when neither resolves. (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) (Luna) Evidence: isOpencodeBinaryAvailable through the resolver; A1 and A3 pass.
- [x] T011 [P] Edit `SKILL.md` line 134 so it parses the version with the resolver's rule. Replace `grep -q '^1\.'`. Re-key the invocation lines that Q4 names, following the sk-doc skill mode. (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`) (DeepSeek) Evidence: the SKILL.md diff, then the doc fix (decision 18); scratch/doc-guard-check.txt.
- [x] T012 [P] Review the T011 diff for facts against research section 6 and iteration-013. Make no edits. Record each finding with its line. (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`) (Luna) Evidence: scratch/review-doc-luna.txt, one P1 and two P2s, all confirmed (decision 17).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the T006 suite. Every case passes. Record the output. (Orchestrator) Evidence: scratch/green-run.txt 23 of 23; scratch/green-run-after-fix.txt 42 passed, 1 pre-existing skip.
- [x] T014 Run the full deep-loop runtime suite. Compare the counts with T001. Record the delta, including the suites that did not move. (Orchestrator) Evidence: scratch/deep-loop-suite-after.txt, 167 files, 2741 passed, 0 failed, 8 skipped; the delta is the 23 new cases.
- [x] T015 Run one smoke dispatch on 1.19.3 through the builder. Record the exit status, the expected token and the lineage file. If the provider is missing, record BLOCKED. (Orchestrator) Evidence: scratch/smoke/v1, exit 0, token, lineage file, 0.002699 USD.
- [x] T016 Run one smoke dispatch on 2.0.32 through the builder with `--standalone`. Record the same three items. (Orchestrator) Evidence: scratch/smoke/v2, exit 0, token, lineage file, 0.001162 USD.
- [x] T017 Run a v2 child with the fixture plugin from T004. Record the log line that shows `AI_SESSION_CHILD`. (Orchestrator) Evidence: scratch/smoke/v2/smoke-v2-plugin.jsonl, AI_SESSION_CHILD=1 in setup() and session.prompt.
- [x] T018 Review `fanout-run.cjs` and `opencode-version.cjs` against `sk-code/sk-code-opencode`, findings first, with file and line for each. Make no edits. (`.skilled/skills/system-deep-loop/runtime/scripts/`) (DeepSeek) Evidence: scratch/review-code-deepseek.txt, one P1 and two P2s (decision 17).
- [x] T019 Confirm each finding from T018 and T012 against the real symptom. Fix each confirmed P0 and P1 finding, copying each file to `scratch/backup/fix-<n>/` first. (Luna) Evidence: decision 18; every confirmed P1 and P2 fixed after a copy to scratch/backup/fix-1/.
- [x] T020 Run the final-state checks in CHK-004 to CHK-006. Check `git status` for the scoped files. Delete `scratch/backup/` and `scratch/probes/` after the final green run. (Orchestrator) Evidence: scratch/static-checks.txt; scoped diff in scratch/evidence.md; backup deleted, probes kept (decision 20).
- [x] T021 Fill the evidence cells in acceptance-criteria.md and the implementation summary. Mark each task `[x]` only where its output is recorded. (`acceptance-criteria.md`, `implementation-summary.md`) (Orchestrator) Evidence: acceptance-criteria.md and implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion is Met or Waived with an ADR
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] spec.md REQ-001 to REQ-009 each map to an acceptance criterion in acceptance-criteria.md, or are checked by a CHK row here. Evidence: REQ-001 to REQ-008 map to AC-001 to AC-004; REQ-009 is checked by CHK-004 and doc-guard-check.txt.
- [x] CHK-002 [P0] The deep-loop runtime suite exits 0 with zero failures, and its pass count is at or above T001. Command, run from the runtime folder: `npx vitest run --no-coverage`. Read the `Tests` line. Evidence: scratch/deep-loop-suite-after.txt: 2741 passed, 0 failed (baseline 2718).
- [x] CHK-003 [P0] The line check in T003 still holds, and the four sites sit where spec.md section 3 says. Evidence: scratch/line-check.txt.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each changed file parses: `node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and `node --check .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`. Evidence: scratch/static-checks.txt, `node --check` exit 0 on both files.
- [x] CHK-011 [P1] The resolver requires only Node built-ins. Check: `rg -n "require\(" .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`, and every hit names a `node:` module. Evidence: node:child_process, node:fs and node:path only (scratch/static-checks.txt).
- [x] CHK-012 [P0] The runner summary shows zero failures and no unhandled error from the new suite. Evidence: scratch/green-run.txt and green-run-after-fix.txt: zero failures, no unhandled error.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met or Waived with an ADR. Evidence: acceptance-criteria.md, all four Met.
- [x] CHK-021 [P0] The red run in T007 recorded the failing assertion for each new case. Evidence: scratch/red-first-failures.txt.
- [x] CHK-022 [P0] The smoke dispatch on each version is recorded with its exit status, token and lineage file (T015, T016). Evidence: scratch/smoke/v1 and smoke/v2 summary.json.
- [x] CHK-023 [P0] The child environment check is recorded (T017). Evidence: scratch/smoke/v2/smoke-v2-plugin.jsonl.
- [x] CHK-024 [P1] The probe-count case shows one probe for two dispatches of one binary (NFR-P01). Evidence: the cache case: two resolves, one probe; a rewrite re-probes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`. The argv builders and the availability check are one change seen from three call sites. Evidence: the opencode builder, the native builder and the availability check all call one resolver.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the grep in T003 is read, and every hit is changed or marked as a non-producer. Evidence: line-check.txt hits: both builders and the check changed; resolveExecutableVersion unchanged by design (L5).
- [x] CHK-FIX-003 [P0] Consumer inventory: the same grep, plus a check of the test files that reach the builders through the runner entry point. Evidence: the test files that build or spawn opencode were inventoried (decision 10) and their stubs updated (decision 11); the four native tests got a v1 stub env (decision 18).
- [x] CHK-FIX-004 [P0] The adversarial table in plan.md section 3 has a test for each row. Evidence: seven adversarial cases in the new suite.
- [x] CHK-FIX-005 [P1] The matrix rows P1 to P5, A1 to A3 and D1 to D4 each have a test name. Evidence: the P, A and D tests are named after their rows.
- [x] CHK-FIX-006 [P1] A hostile `OPENCODE_BIN` value is tested as one argv entry. Evidence: the hostile `$(touch PWNED)` path case; no PWNED file appears.
- [x] CHK-FIX-007 [P1] The evidence cites HEAD at the start of the phase (`06e77ab5fd`) and the scoped diff. Evidence: the phase started at worktree HEAD f8f6156c2d, which sits on 06e77ab5fd; the scoped diff is in scratch/evidence.md.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:static -->
## Static Checks

- [x] CHK-004 [P1] `SKILL.md` no longer contains the old guard. Command: `rg -n "grep -q '\^1" .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`. Expected: no output. Evidence: scratch/static-checks.txt, no output.
- [x] CHK-005 [P0] The v2 renderer carries no v1-only flag. Command: `rg -n -- '--command|--dir|--variant|--pure|--share|--port' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. Each hit must sit in the v1 renderer or in a comment that says why the flag is absent in v2. Evidence: scratch/static-checks.txt, every hit is v1-only.
- [x] CHK-006 [P0] Every v2 argv includes `--standalone`. Check: the red suite covers D2 and D4, and the grep for `--standalone` finds it in the v2 renderer. Evidence: scratch/static-checks.txt and the D2 and D4 tests.
<!-- /ANCHOR:static -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Check: `rg -n -i 'api[_-]?key|secret|password' .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` returns nothing. Evidence: scratch/static-checks.txt, no output.
- [x] CHK-031 [P0] The resolver never builds a shell string. Check: `rg -n 'shell:\s*true|exec\(' .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` returns nothing. Evidence: scratch/static-checks.txt, the one hit is RegExp exec, not a shell.
- [x] CHK-032 [P1] Not applicable beyond CHK-031. No auth surface changes. Evidence: not applicable.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md agree on file names, line numbers and open questions. Evidence: T008 text amended to match plan.md (decision 10).
- [x] CHK-041 [P1] Each comment in the changed code states the durable reason. No comment carries a phase, task or packet label. Evidence: scratch/static-checks.txt.
- [x] CHK-042 [P2] Deferred to 010. The cli-reference table, the prompt templates and the playbooks describe both renderings in the doc sweep. Evidence: deferred to 010 as planned.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: all probe and smoke output is under scratch/; throwaway databases stayed in the session scratchpad.
- [x] CHK-051 [P1] `scratch/backup/` and `scratch/probes/` are deleted before the phase closes. Evidence: amended: scratch/backup/ deleted, scratch/probes/ kept because decisions 2 to 6 and 12 cite it (decision 20).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 11 | 11/11 (CHK-051 amended, decision 20) |
| P2 Items | 1 | 1/1 (deferred to 010) |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
