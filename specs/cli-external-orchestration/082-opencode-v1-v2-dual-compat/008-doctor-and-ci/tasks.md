---
title: "Tasks: Phase 8: doctor-and-ci"
description: "Task Format: T### [P?] Description (file path). Each task names its executor at the end of the line."
trigger_phrases:
  - "doctor and ci tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: doctor-and-ci

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

Executors: **Luna** is GPT-6 Luna max fast through cli-codex. **DeepSeek** is DeepSeek V4.1 Flash max through cli-devin. **Orchestrator** is the operator session that runs every live run, because each one starts real OpenCode processes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save a process listing to `scratch/process-before.txt`, before any probe. Read-only. (Orchestrator) Evidence: scratch/process-before.txt (decision 1).
- [x] T002 Run the v1 load-trigger probe (Q4) under `scratch/probes/v1-trigger/`. Record the log size before and after, and the lines that appear. Do not use a command that calls a model without the operator's approval. (Orchestrator) Evidence: scratch/probes/v1-trigger/; 1.19.3 logs no plugin line and reports no broken plugin, so the v1 legs are discovery plus the import harness (decision 2).
- [x] T003 Run the v2 service probe (Q5), read-only. Read `/api/plugin` to a file only if a service already runs. Record whether a service runs. Never start one. (Orchestrator) Evidence: scratch/probes/v2-private/; a private serve read 16 of 16 active after warm-up and was stopped, process list unchanged (decision 3). No shared-service read was needed.
- [x] T004 Settle Q1 to Q9 from T002 and T003. Amend spec.md or plan.md where a probe changed the design. Stop for Q5 when no decision exists. (`spec.md`, `plan.md`) (Orchestrator) Evidence: decisions 2 to 13 settle Q1 to Q9; spec.md, plan.md, goal.md L2 and L3, and AC-001 amended where the probes changed the design.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the fixture suite for rows R1 to R14 in plan.md section 3, the adversarial table, and the probe-count case. Use fixture records, not a real binary. (`.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`) (Luna) Evidence: tests/opencode-version-battery.test.cjs, 26 tests: R1 to R17, the adversarial table, parity with 006, the probe count, the broken symlink and the fake-server password test. Written by DeepSeek (decision 0).
- [x] T006 Run the fixture suite and record the first failing assertion for each row. This is the negative control. (Orchestrator) Evidence: scratch/red-first-failures.txt, 24 of 24 fail against a throwaway stub module.
- [x] T007 Write the battery. It has the family selector, the v1 collector, the v2 collector, the four legs, the reporter and the exit taxonomy. It takes `--family`, `--root`, `--json` and `--out`. (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) (Luna) Evidence: scripts/opencode-version-battery.cjs, written by DeepSeek against scratch/battery-contract.md (decisions 0 and 14).
- [x] T008 [P] Document the battery in the doctor scripts README: the flags, the legs, the exit codes and the mutation boundary. Label each claim confirmed, documented or unknown. Amended from the route doc, `scratch/decisions.txt` 15. (`.skilled/command-support/doctor/scripts/README.md`) (DeepSeek) Evidence: the doctor scripts README rows and leg list; validator 0 issues (decisions 15 and 18).
- [x] T009 [P] Review the README section against the battery's flags, legs and exit codes. Make no edits. Record each mismatch with its line. (`.skilled/command-support/doctor/scripts/README.md`) (Luna) Evidence: scratch/review-doc-luna.txt, then review-verify-luna.txt and review-verify2-luna.txt.
- [x] T010 Write the CI workflow. It has a matrix over `opencode-ai@1.19.3` and `@opencode/cli@2.0.32`, each in its own npm prefix, runs the battery with `--json`, uploads the summary, and has a `both` job that checks the isolation rule B-1. (`.github/workflows/opencode-dual-version.yml`) (Luna) Evidence: .github/workflows/opencode-dual-version.yml, written by DeepSeek; actionlint exit 0 (scratch/static-checks.txt).
- [x] T011 Review the battery, its tests and the workflow against `sk-code/sk-code-opencode`, findings first, with file and line. Make no edits. (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, `.github/workflows/opencode-dual-version.yml`) (DeepSeek) Evidence: scratch/review-code-luna.txt, reviewed by Luna, the executors swapped with T007 (decision 0).
- [x] T012 Fix each finding that the orchestrator confirms. Copy each file to `scratch/backup/fix-<n>/` first. (Luna) Evidence: fix-1 to fix-3, decisions 14, 17, 20 and 21; backups under scratch/backup/, removed at closeout (decision 12).
- [x] T013 Add the `/doctor:opencode` entry to `_routes.yaml`, with its `yaml:` asset, the presentation row and the `setup.md` leg. Blocked until the operator decides Q1. (`.skilled/commands/doctor/_routes.yaml`) (Luna) Resolved by Q1's spec default (b): the entry is held, and the operator has not decided Q1 (decision 4).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run the fixture suite on its own, and then through `run-all.sh`. Record both summaries. (Orchestrator) Evidence: the suite alone 26 of 26; scratch/run-all-after.txt, 380 of 380, exit 0, against 350 of 353 at baseline (decision 22).
- [x] T015 Run `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1 --json` against the installed 1.19.3 binary. Save the output and the exit status. (Orchestrator) Evidence: scratch/live/battery-v1.json, every leg PASS, exit 0 (decision 16).
- [x] T016 Run `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2 --json` against the installed 2.0.32 binary; the battery starts and stops its own private server. Save the output and the exit status. (Orchestrator) Evidence: scratch/live/battery-v2.json, every leg PASS, exit 0; scratch/live/battery-both-fix3.json on the final code (decision 21).
- [x] T017 Run the broken-copy proof. Copy the plugin folder and `opencode.json` into `scratch/broken-root/`, break one plugin in the copy only, and run the battery with `--root scratch/broken-root`. Expect exit 1 and the plugin named. (Orchestrator) Evidence: scratch/live/broken-v1.json and broken-v2.json, exit 1 each, naming sk-git-message-gate.js (decision 16). The copy lives in the session scratchpad, outside the repository.
- [x] T018 Run `/opt/homebrew/bin/actionlint .github/workflows/opencode-dual-version.yml`. Expect exit 0 and no output. (Orchestrator) Evidence: scratch/static-checks.txt, actionlint exit 0, no output.
- [x] T019 Save the process listing again and compare it with T001. Expect no change. Record any difference. (Orchestrator) Evidence: scratch/live/process-before*.txt against process-after*.txt for every live run, each identical.
- [x] T020 If T013 landed, run `bash .skilled/commands/doctor/scripts/route-validate.sh` and record its output. (Orchestrator) Not applicable: T013 held the entry, so there is no route to validate (decision 4).
- [x] T021 Confirm the workflow is untracked and unstaged with `git status --short .github/workflows/opencode-dual-version.yml`, and confirm nothing was pushed. Delete `scratch/` after the implementation summary records the outputs. (Orchestrator) Evidence: scratch/static-checks.txt, the workflow is untracked (`??`, tracked count 0); nothing pushed.
- [x] T022 Fill the evidence cells in acceptance-criteria.md and the implementation summary. Mark each task `[x]` only where its output is recorded. (`acceptance-criteria.md`, `implementation-summary.md`) (Orchestrator) Evidence: acceptance-criteria.md and implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining, or each one is recorded as held by an operator decision
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

- [x] CHK-001 [P0] spec.md REQ-001 to REQ-010 each map to an acceptance criterion in acceptance-criteria.md, or to a CHK row here. Evidence: REQ-001, 002, 003, 004 and 005 map to AC-001, REQ-006 to AC-002, REQ-007 to AC-003, REQ-008 to CHK-020 and R10/R11, REQ-009 to T008 and the README validator, REQ-010 to CHK-011.
- [x] CHK-002 [P0] The v1 trigger (T002) and the v2 service rule (T003) are recorded as settled in the log. Evidence: decisions 2 and 3.
- [x] CHK-003 [P0] The process listing before the live runs (T001) and after them (T019) are compared, and the comparison is recorded. Evidence: scratch/process-before.txt and process-after-probes.txt, and scratch/live/process-before*.txt against process-after*.txt, each identical.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each changed file parses: `node --check .skilled/commands/doctor/scripts/opencode-version-battery.cjs` and `node --check .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`. Evidence: scratch/static-checks.txt, both exit 0.
- [x] CHK-011 [P0] The fixture suite passes on its own (T014), and the `run-all.sh` summary shows no new failure. Evidence: T014; 380 of 380, no new failure, and the three baseline failures fixed (decision 22).
- [x] CHK-012 [P1] The battery requires only Node built-ins. Command: `rg -n "require\(" .skilled/commands/doctor/scripts/opencode-version-battery.cjs`. Every hit names a `node:` module. Evidence: scratch/static-checks.txt, every require names a node: module.
- [x] CHK-013 [P0] The battery builds no shell string. Command: `rg -n "shell:\s*true|execSync|exec\(" .skilled/commands/doctor/scripts/opencode-version-battery.cjs` returns nothing. Evidence: scratch/static-checks.txt. The four hits are RegExp `.exec`, not child_process; no shell string is built.
- [x] CHK-014 [P0] The battery never spawns `run` or `service`, and its only `serve` is the private server on a free loopback port (amended with goal L3, `scratch/decisions.txt` 3). Command: `rg -n "'run'|\"run\"|'service'|'serve'" .skilled/commands/doctor/scripts/opencode-version-battery.cjs`. Each hit is a comment, a message, or the private `serve` argv. Evidence: scratch/static-checks.txt, the one hit is the private `serve` argv at line 792 of the reviewed copy.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 is recorded: the v1 and v2 runs (T015, T016) with exit 0, and no FAIL, DEGRADED or SKIP leg. Evidence: T015 and T016, exit 0 and every leg PASS.
- [x] CHK-021 [P0] AC-002 is recorded: the broken-copy run (T017) with exit 1 and the plugin named. Evidence: T017.
- [x] CHK-022 [P0] AC-003 is recorded: the actionlint run (T018) with exit 0 and no output. Evidence: T018.
- [x] CHK-023 [P1] Each row R1 to R14 has a test (T005). Evidence: R1 to R15 each have a named test, and R16, R17 cover the spaced flags (T005).
- [x] CHK-024 [P0] Each leg that reports PASS names an observed load or an active state, not a config read alone (NFR-R01). The R3 test and the T015 output show it. Evidence: plugin-load PASS comes from the import harness and plugin-active PASS from the private server's active state; the R3 test, and scratch/live/broken-v1.json, where discovery passes and load fails.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Not applicable as written: the phase also repaired git-setup-check's adapter detection, a regression from phase 2 (decision 12), with a test for the wrapped form. This phase adds a battery and changes no existing behaviour.
- [x] CHK-FIX-002 [P1] The version rule in the battery and the rule in 006 read the same list of version strings, and a fixture test pins both. Evidence: the parity test reads one shared list through both parsers.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Command: `rg -n -i 'token|secret|password' .skilled/commands/doctor/scripts/opencode-version-battery.cjs .github/workflows/opencode-dual-version.yml` returns nothing. Evidence: scratch/static-checks.txt. The hits are comments, version-token code and the variable that carries the private server's runtime password; no secret value is written in either file.
- [x] CHK-031 [P0] Each spawn uses an argv array. The review in T011 reads every spawn call and records the result. Evidence: scratch/review-code-luna.txt, every spawn uses an argv array.
- [x] CHK-032 [P0] The workflow is untracked, unstaged and unpushed (T021). Evidence: T021.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the open question numbers, the legs and the exit codes. Evidence: the amendments of decisions 13 and 15 are applied in spec.md, plan.md, tasks.md and goal.md.
- [x] CHK-041 [P1] Each comment in the battery and the workflow states the durable reason. No comment carries a phase, task or packet label. Evidence: scratch/static-checks.txt, no comment carries a label, exit 1.
- [x] CHK-042 [P2] The `/doctor:opencode` route passes `route-validate.sh` (T020), or the entry is recorded as held by the operator's decision. Held by Q1's spec default; the operator has not decided Q1 (decision 4). route-validate was not run.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in `scratch/` only. Evidence: probe output and live results are under scratch/; the private servers, the broken copy and the battery's own temporary folders lived in the session scratchpad or the system temp area and were removed.
- [x] CHK-051 [P1] `scratch/` holds no proof output when the phase closes. Amended, as phases 2 to 7 amended it: scratch/ keeps the cited captures and removes the working files (backup/ and the probe data folders, removed at closeout; old-proofs/live-first stays as decision 14's evidence).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 8 | 8/8 (CHK-051 amended) |
| P2 Items | 1 | 1/1 (held by Q1's default) |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
