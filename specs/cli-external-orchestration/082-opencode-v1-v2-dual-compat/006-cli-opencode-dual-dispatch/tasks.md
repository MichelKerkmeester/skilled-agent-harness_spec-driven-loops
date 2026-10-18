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

- [ ] T001 Run the deep-loop runtime suite and save its output under `scratch/`. Record the pass count, the fail count and the file count. This suite is not in the 001 baseline. (`.skilled/skills/system-deep-loop/runtime`) (Orchestrator)
- [ ] T002 [P] Copy `fanout-run.cjs` and `SKILL.md` to `scratch/backup/`. (Orchestrator)
- [ ] T003 Rerun the line check. The four sites must sit at lines 2258, 2324, 2923 and 2961. Stop if they moved. Run `rg -n 'buildNativeLineageCommand|buildOpencodeLineageCommand|isOpencodeBinaryAvailable|resolveExecutableVersion' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) (Orchestrator)
- [ ] T004 Run the three live probes in `scratch/probes/`, using `run --standalone` in a scratch project. Probe the working directory with and without a positional path (Q3). Probe a bare `/family:name args` message (Q2). Probe the child environment with a fixture plugin that logs `AI_SESSION_CHILD`. Read the process list before and after, and record both. (Orchestrator)
- [ ] T005 Settle Q1 to Q5 from the T004 output. Amend spec.md or plan.md if a probe changed the design, and name the amendment in the log. (`spec.md`, `plan.md`) (Orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Write the red tests first. Cover rows P1 to P5, A1 to A3 and D1 to D4 in plan.md, the adversarial table, and the cache count. (`.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`) (Luna)
- [ ] T007 Run the T006 suite and record the first failing assertion for each case. This is the negative control. (Orchestrator)
- [ ] T008 Create the resolver. It picks the first binary in the order `$OPENCODE_BIN`, `opencode2`, `opencode`, runs `--version` through an argv array, parses the output, refuses what does not parse, and caches by realpath, size and mtime. (`.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`) (Luna)
- [ ] T009 Add the v1 renderer and the v2 renderer to `buildOpencodeLineageCommand` (line 2324) and `buildNativeLineageCommand` (line 2258). The v2 renderer adds `run --standalone`, uses `#variant`, sets the spawn cwd, and drops the v1-only flags. The v2 native branch fails closed until Q2 is decided. (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) (Luna)
- [ ] T010 Route the table entry at line 2923 and the availability check at line 2961 through the resolver. The check accepts `opencode2` alone, and the error names both binaries when neither resolves. (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) (Luna)
- [ ] T011 [P] Edit `SKILL.md` line 134 so it parses the version with the resolver's rule. Replace `grep -q '^1\.'`. Re-key the invocation lines that Q4 names, following the sk-doc skill mode. (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`) (DeepSeek)
- [ ] T012 [P] Review the T011 diff for facts against research section 6 and iteration-013. Make no edits. Record each finding with its line. (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`) (Luna)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Rerun the T006 suite. Every case passes. Record the output. (Orchestrator)
- [ ] T014 Run the full deep-loop runtime suite. Compare the counts with T001. Record the delta, including the suites that did not move. (Orchestrator)
- [ ] T015 Run one smoke dispatch on 1.19.3 through the builder. Record the exit status, the expected token and the lineage file. If the provider is missing, record BLOCKED. (Orchestrator)
- [ ] T016 Run one smoke dispatch on 2.0.32 through the builder with `--standalone`. Record the same three items. (Orchestrator)
- [ ] T017 Run a v2 child with the fixture plugin from T004. Record the log line that shows `AI_SESSION_CHILD`. (Orchestrator)
- [ ] T018 Review `fanout-run.cjs` and `opencode-version.cjs` against `sk-code/sk-code-opencode`, findings first, with file and line for each. Make no edits. (`.skilled/skills/system-deep-loop/runtime/scripts/`) (DeepSeek)
- [ ] T019 Confirm each finding from T018 and T012 against the real symptom. Fix each confirmed P0 and P1 finding, copying each file to `scratch/backup/fix-<n>/` first. (Luna)
- [ ] T020 Run the final-state checks in CHK-004 to CHK-006. Check `git status` for the scoped files. Delete `scratch/backup/` and `scratch/probes/` after the final green run. (Orchestrator)
- [ ] T021 Fill the evidence cells in acceptance-criteria.md and the implementation summary. Mark each task `[x]` only where its output is recorded. (`acceptance-criteria.md`, `implementation-summary.md`) (Orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion is Met or Waived with an ADR
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

- [ ] CHK-001 [P0] spec.md REQ-001 to REQ-009 each map to an acceptance criterion in acceptance-criteria.md, or are checked by a CHK row here.
- [ ] CHK-002 [P0] The deep-loop runtime suite exits 0 with zero failures, and its pass count is at or above T001. Command, run from the runtime folder: `npx vitest run --no-coverage`. Read the `Tests` line.
- [ ] CHK-003 [P0] The line check in T003 still holds, and the four sites sit where spec.md section 3 says.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each changed file parses: `node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and `node --check .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`.
- [ ] CHK-011 [P1] The resolver requires only Node built-ins. Check: `rg -n "require\(" .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`, and every hit names a `node:` module.
- [ ] CHK-012 [P0] The runner summary shows zero failures and no unhandled error from the new suite.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is Met or Waived with an ADR.
- [ ] CHK-021 [P0] The red run in T007 recorded the failing assertion for each new case.
- [ ] CHK-022 [P0] The smoke dispatch on each version is recorded with its exit status, token and lineage file (T015, T016).
- [ ] CHK-023 [P0] The child environment check is recorded (T017).
- [ ] CHK-024 [P1] The probe-count case shows one probe for two dispatches of one binary (NFR-P01).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class: `cross-consumer`. The argv builders and the availability check are one change seen from three call sites.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: the grep in T003 is read, and every hit is changed or marked as a non-producer.
- [ ] CHK-FIX-003 [P0] Consumer inventory: the same grep, plus a check of the test files that reach the builders through the runner entry point.
- [ ] CHK-FIX-004 [P0] The adversarial table in plan.md section 3 has a test for each row.
- [ ] CHK-FIX-005 [P1] The matrix rows P1 to P5, A1 to A3 and D1 to D4 each have a test name.
- [ ] CHK-FIX-006 [P1] A hostile `OPENCODE_BIN` value is tested as one argv entry.
- [ ] CHK-FIX-007 [P1] The evidence cites HEAD at the start of the phase (`06e77ab5fd`) and the scoped diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:static -->
## Static Checks

- [ ] CHK-004 [P1] `SKILL.md` no longer contains the old guard. Command: `rg -n "grep -q '\^1" .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`. Expected: no output.
- [ ] CHK-005 [P0] The v2 renderer carries no v1-only flag. Command: `rg -n -- '--command|--dir|--variant|--pure|--share|--port' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. Each hit must sit in the v1 renderer or in a comment that says why the flag is absent in v2.
- [ ] CHK-006 [P0] Every v2 argv includes `--standalone`. Check: the red suite covers D2 and D4, and the grep for `--standalone` finds it in the v2 renderer.
<!-- /ANCHOR:static -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Check: `rg -n -i 'api[_-]?key|secret|password' .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` returns nothing.
- [ ] CHK-031 [P0] The resolver never builds a shell string. Check: `rg -n 'shell:\s*true|exec\(' .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` returns nothing.
- [ ] CHK-032 [P1] Not applicable beyond CHK-031. No auth surface changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md agree on file names, line numbers and open questions.
- [ ] CHK-041 [P1] Each comment in the changed code states the durable reason. No comment carries a phase, task or packet label.
- [ ] CHK-042 [P2] Deferred to 010. The cli-reference table, the prompt templates and the playbooks describe both renderings in the doc sweep.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/backup/` and `scratch/probes/` are deleted before the phase closes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
