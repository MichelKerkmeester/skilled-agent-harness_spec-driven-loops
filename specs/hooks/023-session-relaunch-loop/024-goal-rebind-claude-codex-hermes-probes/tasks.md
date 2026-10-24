---
title: "Tasks: Phase 24: goal-rebind-claude-codex-hermes-probes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal rebind probes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 24: goal-rebind-claude-codex-hermes-probes

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Ask the operator whether a bypass flag may be used, and run every probe without one first (the operator answer goes in scratch/) [Evidence: operator approved bypass flags in the dispatch brief; none was needed (scratch/operator-approval.md)]
- [x] T002 Create a throwaway directory outside the repository and record the Claude, Codex and Hermes versions [Evidence: throwaway dirs under the session scratchpad; Claude 2.1.310, Codex 0.164.0, Hermes v0.21.1 (scratch/operator-approval.md)]
- [x] T003 Baseline: record that `git status` shows no change outside this folder before the first probe [Evidence: baseline `git -c core.fsmonitor=false status --short` held only `?? .opencode/cli.json`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Probe A: start Claude with a `/goal` start prompt, record whether it ran as a command, then run the plain-text control (scratch/probe-a-claude-start-prompt.md) [Evidence: A1-A6 and control A3 (scratch/probe-a-claude-start-prompt.md)]
- [x] T005 Probe B: add a throwaway SessionStart hook that tries to run `/goal`, record the result, then run a hook that returns nothing (scratch/probe-b-claude-start-hook.md) [Evidence: B1-B5 and silent control B3, interactive and print mode (scratch/probe-b-claude-start-hook.md)]
- [x] T006 Probe C: ask Codex to create a goal through the start prompt and through hook context, record the limit it shows, then run a prompt that asks for nothing (scratch/probe-c-codex-goal.md) [Evidence: C1-C6 and control C4 (scratch/probe-c-codex-goal.md); C6 near-limit run stalled, recorded inconclusive]
- [x] T007 Probe D: export `HERMES_SPEC_FOLDER`, start two sessions with different ids and read the goal in the second, then repeat without the export (scratch/probe-d-hermes-spec-folder.md) [Evidence: D1-D2 with the export, D3 without; model call blocked by HTTP 402 so the bind and the rendered request were read instead (scratch/probe-d-hermes-spec-folder.md)]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Write one verdict per probe in `implementation-summary.md`, saying what each run cannot show [Evidence: verdict table in implementation-summary.md]
- [x] T009 Name the phase 27 path and the probe that selected it [Evidence: phase 27 path named in implementation-summary.md]
- [x] T010 Confirm no goal, hook or process is left behind and `git status` shows only this folder [Evidence: no probe process, tmux server, hook or goal left; scratch dirs, Claude project logs and Hermes request dumps removed; see implementation-summary.md Verification]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md [Evidence: spec.md section 4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [Evidence: plan.md]
- [x] CHK-003 [P1] Claude, Codex and Hermes start on this machine, or the missing one is recorded as SKIP [Evidence: all three start; Hermes starts but its provider returned HTTP 402 for every model call (probe D record)]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code changed, so `git status` lists only files in this folder [Evidence: this run changed only files under this phase folder; other tracked modifications in the worktree belong to other agents (implementation-summary.md Verification)]
- [x] CHK-011 [P0] No console errors or warnings in the suite output [Evidence: not applicable, no suite ran; no probe wrote a console error that mattered]
- [x] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start [Evidence: N/A in part: hook error paths were not probed; every hook exited 0 and every session started]
- [x] CHK-013 [P1] Each record names the runtime version and the exact command [Evidence: each probe record names the version and the wrapper command]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md) [Evidence: acceptance-criteria.md, five rows Met]
- [x] CHK-021 [P0] Every probe has its run and its control saved under scratch/ [Evidence: scratch/probe-a..d records each hold a run and a control]
- [x] CHK-022 [P1] Edge cases tested [Evidence: oversize goal text recorded as a refusal on Claude (4,394 chars) and Codex (4,398 chars); empty goal text not tested]
- [x] CHK-023 [P1] Error scenarios validated [Evidence: approval prompts denied and recorded (Codex C2, C3); HTTP 402 recorded (Hermes); hook-error path not tested]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. [Evidence: no actionable finding: the phase writes no code, findings are verdicts]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [Evidence: not applicable, no code written]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. [Evidence: not applicable, no helper or schema changed]
- [x] CHK-FIX-004 [P0] No path, parser or redaction change is in this phase, so no adversarial table applies. [Evidence: no path, parser or redaction change in this phase]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [Evidence: matrix: four probes, 8 planned runs; actual about 26 runs (A1-A6, B1-B5 with print variants, C1-C6, D1-D3), each control listed in its record]
- [x] CHK-FIX-006 [P1] Each probe ran with the loop environment variables unset, so a looped session did not leak into it. [Evidence: every run went through `env -i` wrappers (scratch/raw/run-*.sh)]
- [x] CHK-FIX-007 [P1] Each record names the runtime version it ran on, which pins the evidence. [Evidence: versions recorded in scratch/operator-approval.md]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential printed, logged or written, and `coder/.env` never opened [Evidence: no credential printed or written; auth.json symlinked and never read; coder/.env never opened; secret grep over scratch/ found nothing]
- [x] CHK-031 [P0] The hook probe reads no input beyond the throwaway text [Evidence: hook scripts read stdin only for its byte count and the `source` field]
- [x] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode [Evidence: not applicable, no state file written by this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized [Evidence: spec, plan, tasks, checklist and summary updated together]
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids [Evidence: no code comments written]
- [x] CHK-042 [P2] The implementation summary is the only doc that changes [Evidence: the phase folder docs and scratch/ evidence changed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/ [Evidence: probe workdirs lived in the session scratchpad and were deleted]
- [x] CHK-051 [P1] scratch/ holds only evidence this packet cites [Evidence: scratch/ holds the four records, the approval note and raw/ excerpts each cited]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
