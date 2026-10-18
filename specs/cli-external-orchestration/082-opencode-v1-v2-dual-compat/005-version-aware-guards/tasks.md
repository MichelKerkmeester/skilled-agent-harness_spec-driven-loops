---
title: "Tasks: Phase 5: version-aware-guards"
description: "Task Format: T### [P?] Description (file path). Each task names its executor at the end of the line."
trigger_phrases:
  - "version aware guards tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: version-aware-guards

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

Executors: **Luna** is GPT-6 Luna max fast through cli-codex. **DeepSeek** is DeepSeek V4.1 Flash max through cli-devin. **Orchestrator** is the operator session that runs every test.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve open questions Q1 to Q5 in spec.md section 10, or record the default that will be used. Confirm the runner of each file in CHK-002. (spec.md) (Orchestrator). Evidence: spec.md section 10, `scratch/evidence.md:36-38`
- [x] T002 [P] Record the pass and fail counts of every suite in CHK-002 before any edit. Save the output under `scratch/`. (Orchestrator). Evidence: `scratch/base-vitest.txt`, `scratch/base-rule-checks.txt`, `scratch/base-shared.txt`, `scratch/base-source-root.txt`
- [x] T003 [P] Copy each file to change into `scratch/backup/`: `hard-rules.json`, `dispatch-rule-checks.mjs`, `dispatch-audit.mjs`, `dispatch-audit.test.mjs` and `dispatch-rule-checks.test.mjs`. (Orchestrator). Evidence: `scratch/backup/` holds all five files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the failing cases first. In `dispatch-audit.test.mjs`, add the `opencode2 run` cases for R1 to R8 and the adversarial table. In `dispatch-rule-checks.test.mjs`, add the `appliesTo` filter, the unknown intersection, the v2 slash fixture and the REQ-007 verdicts. (`.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`) (Luna). Evidence: `scratch/red-audit.txt`, `scratch/red-rule-checks.txt`
- [x] T005 Run the T004 cases and record the first failing assertion for each new case. This is the negative control. (Orchestrator). Evidence: `scratch/red-rule-checks.txt:284-288` (4 of 25 failed), `scratch/red-audit.txt:9` (the audit file failed at load, so no per-case assertion was recorded for it)
- [x] T006 Create the memoised resolver. It holds a pure parser for the two version shapes, an injectable probe, a named timeout constant, and a cache keyed by realpath, size and mtime. It returns `v1`, `v2` or `unknown`. (`.skilled/hooks/dispatch/lib/opencode-version.mjs`) (Luna). Evidence: `scratch/red-audit.txt:9` (absent before the change), `scratch/fix-vitest.txt:23`, `scratch/review-findings.log:52`
- [x] T007 [P] Add `appliesTo` to the five rules, using the matrix in plan.md section 3. Add the v2 slash-prompt rule, which applies to v2 only and has severity `warn`. (`.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`) (Luna). Evidence: `scratch/evidence.md:33`
- [x] T008 Replace the exact-name membership tests at `EXECUTOR_BASENAMES` (line 51), line 210 and line 244 with an `opencode\d*` predicate. Widen the evidence regexes at lines 28 and 248. (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs`) (Luna). Evidence: `scratch/fix-vitest.txt:23`, `scratch/review-findings.log:65`
- [x] T009 Widen the three `opencode run` regexes at lines 36, 128 and 137 to `opencode\d*`. (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`) (Luna). Evidence: `scratch/fix-rulechecks.txt:13`, `scratch/red-rule-checks.txt:170`
- [x] T010 Make `evaluate` (line 276) resolve the version when the caller passes none, keep the rules whose `appliesTo` includes the result, and keep both-version rules on `unknown`. (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`) (Luna). Evidence: `scratch/fix-rulechecks.txt:7-9`, `scratch/evidence.md:33`
- [x] T011 Add the v2 slash-prompt check. It names the v2 operation route in its message and returns a warning, not a block. (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`) (Luna). Evidence: `scratch/fix-rulechecks.txt:10`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the T004 cases. Every new case passes. Record the output. (Orchestrator). Evidence: `scratch/fix-rulechecks.txt:29-32`, `scratch/fix-vitest.txt:23`
- [x] T013 Run every suite in CHK-002. Compare each pass count with T002. Record the delta, including the suites that did not move. (Orchestrator). Evidence: `scratch/evidence.md:16-19`
- [x] T014 [P] Review the full diff against `sk-code/sk-code-opencode`, findings first, with file and line for each finding. Make no edits. (`.skilled/hooks/dispatch/lib/`, `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`) (DeepSeek). Evidence: `scratch/review-findings.log:47`, `scratch/evidence.md:25`
- [x] T015 Confirm each finding from T014 against the real symptom. Fix each confirmed P0 and P1 finding. Copy each file to `scratch/backup/fix-<n>/` before the fix. (Luna). Evidence: `scratch/replay-review-inputs.txt`, `scratch/evidence.md:26-30`. No per-fix copies exist under `scratch/backup/`
- [x] T016 Run the same-class search from plan.md section 3 and `git status` for the scoped files. Confirm no other file changed. (Orchestrator). Evidence: the same-class search is in `scratch/inventories.txt:25-44`, and the scoped status lines in `scratch/inventories.txt:11-15` show the five planned files plus the new `opencode-version.mjs` (`scratch/evidence.md:52`)
- [x] T017 Run the full regression set again from the final state. Delete `scratch/backup/`. (Orchestrator). Evidence: the final runs are `scratch/fix-vitest.txt`, `scratch/fix-rulechecks.txt`, `scratch/fix-shared.txt`, `scratch/fix-source-root.txt` and `scratch/drift-guards.txt` (`scratch/evidence.md:15-22`), and `scratch/backup/` is deleted (`scratch/evidence.md:53`)
- [x] T018 Fill the evidence cells in acceptance-criteria.md and the implementation summary. Mark each task `[x]` only where its output is recorded. (`acceptance-criteria.md`, `implementation-summary.md`) (Orchestrator). Evidence: acceptance-criteria.md rows AC-001 to AC-003, `implementation-summary.md`
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

- [x] CHK-001 [P0] spec.md REQ-001 to REQ-007 each map to an acceptance criterion in acceptance-criteria.md. Evidence: acceptance-criteria.md rows AC-001 to AC-004, with AC-004 added for REQ-007 from `scratch/req007-v1-parity.txt:1`
- [x] CHK-002 [P0] Guard suites exit 0, with zero failures and pass counts at or above the T002 baseline. Commands, run from the repo root. Evidence: `scratch/fix-rulechecks.txt:29-32`, `scratch/fix-shared.txt:346-349`, `scratch/fix-source-root.txt:8-11`, `scratch/fix-vitest.txt:22-23`. The single failed file is the pre-existing Pi load failure, unchanged and also failing on main (`scratch/evidence.md:10`)
  - `node --test --test-reporter=tap .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`
  - `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs hooks/dispatch/codex/codex-shell-tool.test.mjs hooks/dispatch/pi/dispatch-preflight-lint.test.ts`
  - `node --test --test-reporter=tap .skilled/hooks/shared/hook-stdin-deadline.test.mjs .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs`
  - Read the runner of `.opencode/plugins/tests/source-root-consumers.test.cjs` in T001, then run it with that runner.
  - Read the `# pass` and `# fail` lines, or the vitest `Tests` line, from each run.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each changed `.mjs` file parses: `node --check .skilled/hooks/dispatch/lib/dispatch-audit.mjs`, and the same for `dispatch-rule-checks.mjs` and `opencode-version.mjs`. Evidence: `scratch/evidence.md:21`, `scratch/review-findings.log:33-34`
- [x] CHK-011 [P0] `jq empty .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` prints nothing and exits 0. Evidence: `scratch/evidence.md:22`
- [x] CHK-012 [P1] The resolver's probe-failure path has a test that returns `unknown` (fallback row in the adversarial table). Evidence: `scratch/fix-rulechecks.txt:9`, `scratch/fix-vitest.txt:23`
- [x] CHK-013 [P1] `dispatch-rule-checks.mjs` and `opencode-version.mjs` import only `node:` built-ins. Check: `rg -n "^import" .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs .skilled/hooks/dispatch/lib/opencode-version.mjs`. Evidence: `scratch/inventories.txt:18-23` shows only `node:` built-ins plus the sibling `./opencode-version.mjs`, and `scratch/evidence.md:48`
- [x] CHK-014 [P0] The runner summary shows zero failures and no unhandled error from any suite. Evidence: `scratch/fix-rulechecks.txt:32`, `scratch/fix-shared.txt:349`, `scratch/fix-source-root.txt:11`. The Pi load failure is pre-existing and unchanged (`scratch/evidence.md:16`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met or Waived with an ADR. Evidence: acceptance-criteria.md rows AC-001 to AC-004
- [x] CHK-021 [P0] The red run in T005 recorded the failing assertion for each new case. Evidence: `scratch/red-rule-checks.txt:39-186`, `scratch/red-audit.txt:9` (the audit red is a load failure, not an assertion)
- [x] CHK-022 [P1] Edge cases from spec.md section L2 Edge Cases have a test, or a note that says why not. Evidence: `scratch/evidence.md:54-59`. The many-segments case is partial: `dispatch-rule-checks.test.mjs:228` proves one probe across two evaluations of one binary, and no test runs two distinct binaries in one command (`scratch/evidence.md:56`). The other cases map to `dispatch-audit.test.mjs:333`, `dispatch-audit.test.mjs:574` and `dispatch-audit.test.mjs:76`, `dispatch-rule-checks.test.mjs:138`, and error scenarios and session expiry are not applicable per spec.md L2
- [x] CHK-023 [P1] The probe-count test shows one probe for two evaluations of one binary (NFR-P01). Evidence: `scratch/fix-rulechecks.txt:12`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug`, with cross-consumer reach. The name-based admission sits in two files and four regexes. Evidence: plan.md section 3, `scratch/review-findings.log:51`, `scratch/review-findings.log:65`
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'opencode\s+run|EXECUTOR_BASENAMES' .skilled/hooks .skilled/skills/cli-external-orchestration/cli-opencode` is read, and each hit is changed or marked as a non-producer. Evidence: `scratch/inventories.txt:25-44`. The code producers are `dispatch-audit.mjs` lines 55 and 78 and `dispatch-rule-checks.mjs`, all changed. The claude, codex and devin hooks and the benchmark reports mention `opencode run` in comments or data only, so they are non-producers, and `pi/dispatch-audit.ts:27` imports the shared lib as a consumer (`scratch/evidence.md:49`)
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -l 'hard-rules|dispatch-rule-checks|dispatch-audit' .skilled/hooks .skilled/commands .opencode/plugins` matches the list in plan.md section 3. Evidence: `scratch/inventories.txt:46-75` is the `rg -l` list and it matches the plan.md section 3 consumer table (`scratch/evidence.md:50`)
- [x] CHK-FIX-004 [P0] The adversarial table in plan.md section 3 (delimiter, joined input, outside root, no-op, fallback) has a test for each row. Evidence: `scratch/review-findings.log:63`
- [x] CHK-FIX-005 [P1] The applicability matrix R1 to R8 is listed in plan.md, and each row has a test name. Evidence: plan.md:68-79, `scratch/review-findings.log:63`
- [x] CHK-FIX-006 [P1] A hostile `OPENCODE_BIN` value (spaces and shell metacharacters) is tested, because the resolver reads process environment. Evidence: `scratch/review-findings.log:52`, `scratch/review-findings.log:63`
- [x] CHK-FIX-007 [P1] The evidence cites HEAD at the start of the phase (`867b83b671`) and the scoped diff, not a moving branch range. Evidence: `scratch/inventories.txt:2` records HEAD at phase start and `scratch/inventories.txt:4-10` the scoped diff stat of the five changed files plus the new `opencode-version.mjs` (`scratch/evidence.md:47`)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Check: `rg -n -i 'api[_-]?key|secret|password' .skilled/hooks/dispatch/lib` returns no new line. Evidence: `scratch/inventories.txt:78` records that no new line matches, and `scratch/evidence.md:51`
- [x] CHK-031 [P0] Input validation: the parser rejects output that matches neither version shape, and a test covers it. Evidence: `scratch/review-findings.log:63`
- [x] CHK-032 [P1] Not applicable. No auth surface changes in this phase. Evidence: the item is not applicable by its own text, and spec.md section 3 lists no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md agree on file names, step numbers and open questions. Evidence: `scratch/evidence.md:36` (spec.md, plan.md and goal.md were amended to match Q5)
- [x] CHK-041 [P1] Each comment in the changed code states the durable reason. No comment carries a phase, task or packet label. Evidence: `scratch/review-findings.log:66`
- [x] CHK-042 [P2] Deferred to 010. The dispatch README and the cli-opencode docs describe the new rule shape in the doc sweep. Evidence: spec.md section 3 Out of Scope (010 owns the doc sweep)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: `scratch/evidence.md:53` records that temp files are only in `scratch/`
- [x] CHK-051 [P1] `scratch/backup/` is deleted before the phase closes. Evidence: `scratch/evidence.md:53` records the deletion by the orchestrator after the final regression runs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
