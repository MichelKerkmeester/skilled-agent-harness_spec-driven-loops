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

- [ ] T001 Save a process listing to `scratch/process-before.txt`, before any probe. Read-only. (Orchestrator)
- [ ] T002 Run the v1 load-trigger probe (Q4) under `scratch/probes/v1-trigger/`. Record the log size before and after, and the lines that appear. Do not use a command that calls a model without the operator's approval. (Orchestrator)
- [ ] T003 Run the v2 service probe (Q5), read-only. Read `/api/plugin` to a file only if a service already runs. Record whether a service runs. Never start one. (Orchestrator)
- [ ] T004 Settle Q1 to Q9 from T002 and T003. Amend spec.md or plan.md where a probe changed the design. Stop for Q5 when no decision exists. (`spec.md`, `plan.md`) (Orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the fixture suite for rows R1 to R14 in plan.md section 3, the adversarial table, and the probe-count case. Use fixture records, not a real binary. (`.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`) (Luna)
- [ ] T006 Run the fixture suite and record the first failing assertion for each row. This is the negative control. (Orchestrator)
- [ ] T007 Write the battery. It has the family selector, the v1 collector, the v2 collector, the four legs, the reporter and the exit taxonomy. It takes `--family`, `--root`, `--json` and `--out`. (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`) (Luna)
- [ ] T008 [P] Write the route doc in the sk-doc command mode. Cover the flags, the legs, the exit codes and the repair lines. Label each claim confirmed, documented or unknown. (`.skilled/commands/doctor/opencode.md`) (DeepSeek)
- [ ] T009 [P] Review the route doc against the battery's flags, legs and exit codes. Make no edits. Record each mismatch with its line. (`.skilled/commands/doctor/opencode.md`) (Luna)
- [ ] T010 Write the CI workflow. It has a matrix over `opencode-ai@1.19.3` and `@opencode/cli@2.0.32`, each in its own npm prefix, runs the battery with `--json`, uploads the summary, and has a `both` job that checks the isolation rule B-1. (`.github/workflows/opencode-dual-version.yml`) (Luna)
- [ ] T011 Review the battery, its tests and the workflow against `sk-code/sk-code-opencode`, findings first, with file and line. Make no edits. (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, `.github/workflows/opencode-dual-version.yml`) (DeepSeek)
- [ ] T012 Fix each finding that the orchestrator confirms. Copy each file to `scratch/backup/fix-<n>/` first. (Luna)
- [ ] T013 [B] Add the `/doctor:opencode` entry to `_routes.yaml`, with its `yaml:` asset, the presentation row and the `setup.md` leg. Blocked until the operator decides Q1. (`.skilled/commands/doctor/_routes.yaml`) (Luna)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the fixture suite on its own, and then through `run-all.sh`. Record both summaries. (Orchestrator)
- [ ] T015 Run `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1 --json` against the installed 1.19.3 binary. Save the output and the exit status. (Orchestrator)
- [ ] T016 Run `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2 --json` against the running 2.0.32 service. Save the output and the exit status. (Orchestrator)
- [ ] T017 Run the broken-copy proof. Copy the plugin folder and `opencode.json` into `scratch/broken-root/`, break one plugin in the copy only, and run the battery with `--root scratch/broken-root`. Expect exit 1 and the plugin named. (Orchestrator)
- [ ] T018 Run `/opt/homebrew/bin/actionlint .github/workflows/opencode-dual-version.yml`. Expect exit 0 and no output. (Orchestrator)
- [ ] T019 Save the process listing again and compare it with T001. Expect no change. Record any difference. (Orchestrator)
- [ ] T020 [B] If T013 landed, run `bash .skilled/commands/doctor/scripts/route-validate.sh` and record its output. (Orchestrator)
- [ ] T021 Confirm the workflow is untracked and unstaged with `git status --short .github/workflows/opencode-dual-version.yml`, and confirm nothing was pushed. Delete `scratch/` after the implementation summary records the outputs. (Orchestrator)
- [ ] T022 Fill the evidence cells in acceptance-criteria.md and the implementation summary. Mark each task `[x]` only where its output is recorded. (`acceptance-criteria.md`, `implementation-summary.md`) (Orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining, or each one is recorded as held by an operator decision
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

- [ ] CHK-001 [P0] spec.md REQ-001 to REQ-010 each map to an acceptance criterion in acceptance-criteria.md, or to a CHK row here.
- [ ] CHK-002 [P0] The v1 trigger (T002) and the v2 service rule (T003) are recorded as settled in the log.
- [ ] CHK-003 [P0] The process listing before the live runs (T001) and after them (T019) are compared, and the comparison is recorded.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each changed file parses: `node --check .skilled/commands/doctor/scripts/opencode-version-battery.cjs` and `node --check .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`.
- [ ] CHK-011 [P0] The fixture suite passes on its own (T014), and the `run-all.sh` summary shows no new failure.
- [ ] CHK-012 [P1] The battery requires only Node built-ins. Command: `rg -n "require\(" .skilled/commands/doctor/scripts/opencode-version-battery.cjs`. Every hit names a `node:` module.
- [ ] CHK-013 [P0] The battery builds no shell string. Command: `rg -n "shell:\s*true|execSync|exec\(" .skilled/commands/doctor/scripts/opencode-version-battery.cjs` returns nothing.
- [ ] CHK-014 [P0] The battery never spawns `run`, `service` or `serve`. Command: `rg -n "'run'|\"run\"|'service'|'serve'" .skilled/commands/doctor/scripts/opencode-version-battery.cjs`. Each hit is a refusal message or a comment, and none is an argv entry.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 is recorded: the v1 and v2 runs (T015, T016) with exit 0, and no FAIL, DEGRADED or SKIP leg.
- [ ] CHK-021 [P0] AC-002 is recorded: the broken-copy run (T017) with exit 1 and the plugin named.
- [ ] CHK-022 [P0] AC-003 is recorded: the actionlint run (T018) with exit 0 and no output.
- [ ] CHK-023 [P1] Each row R1 to R14 has a test (T005).
- [ ] CHK-024 [P0] Each leg that reports PASS names an observed load or an active state, not a config read alone (NFR-R01). The R3 test and the T015 output show it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Not applicable. This phase adds a battery and changes no existing behaviour.
- [ ] CHK-FIX-002 [P1] The version rule in the battery and the rule in 006 read the same list of version strings, and a fixture test pins both.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Command: `rg -n -i 'token|secret|password' .skilled/commands/doctor/scripts/opencode-version-battery.cjs .github/workflows/opencode-dual-version.yml` returns nothing.
- [ ] CHK-031 [P0] Each spawn uses an argv array. The review in T011 reads every spawn call and records the result.
- [ ] CHK-032 [P0] The workflow is untracked, unstaged and unpushed (T021).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the open question numbers, the legs and the exit codes.
- [ ] CHK-041 [P1] Each comment in the battery and the workflow states the durable reason. No comment carries a phase, task or packet label.
- [ ] CHK-042 [P2] The `/doctor:opencode` route passes `route-validate.sh` (T020), or the entry is recorded as held by the operator's decision.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds no proof output when the phase closes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | [ ]/14 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
